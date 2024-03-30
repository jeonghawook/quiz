import { BadRequestException, PipeTransform } from "@nestjs/common";
import { QuizSubjects } from "../enums/quiz-enums";

export class QuizValidationPipe implements PipeTransform{
    readonly QuizSubjectsOptions = [
        QuizSubjects.JAVASCRIPT,
        QuizSubjects.nodejs,
        QuizSubjects.PERSONEL
    ]

    transform(value: any) {
        value = value.toUpperCase();
    
        if (!this.isStatusValid(value)) {
          throw new BadRequestException(`${value} isn't in the status option`);
        }
    
        return value;
      }
    
      private isStatusValid(status: any) {
        const index = this.QuizSubjectsOptions.indexOf(status);
        return index !== -1;
      }
    
}

