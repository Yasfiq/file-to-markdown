// Core data models

export interface SlideModel {
  slideNumber: number;
  title: string | null;
  content: ContentElement[];
  notes: string | null;
  warnings: ExtractionWarning[];
}

export type ContentElement =
  | { type: 'paragraph'; text: string }
  | { type: 'bullet'; level: number; text: string }
  | { type: 'table'; headers: string[] | null; rows: string[][] }
  | { type: 'unsupported'; elementType: UnsupportedElementType; message: string };

export type UnsupportedElementType =
  | 'image'
  | 'chart'
  | 'diagram'
  | 'video'
  | 'embedded-object'
  | 'smartart'
  | 'math';

export interface ExtractionWarning {
  slideNumber: number;
  elementType: UnsupportedElementType;
  message: string;
}

export interface Presentation {
  title: string;
  slides: SlideModel[];
}

// Result type (error handling contract)

export type Result<T, E = ErrorDetails> =
  | { success: true; data: T }
  | { success: false; error: E };

export type ErrorCode =
  | 'INVALID_TYPE'
  | 'FILE_TOO_LARGE'
  | 'CORRUPTED_FILE'
  | 'NO_SLIDES'
  | 'PARSE_FAILURE';

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
}

// Processing result

export interface ProcessingResult {
  success: boolean;
  data?: { markdown: string; warnings: ExtractionWarning[]; slideCount: number };
  error?: ErrorDetails;
}
