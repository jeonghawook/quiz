export class CreateFlashcardDto {
  question: string;
  answer: string;
}

export class UpdateFlashcardDto {
  flashcardId: number;
  question: string;
  answer: string;
}
