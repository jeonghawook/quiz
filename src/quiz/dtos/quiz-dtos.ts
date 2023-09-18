import { Users } from "src/users/users.entity"

export class CreateQuizDto {
    question :string
    answer:string
    level:number
    option :string[]
    userId : number
}

export class UpdateQuizDto{
    question: string
    answer:string
    userId: number
}