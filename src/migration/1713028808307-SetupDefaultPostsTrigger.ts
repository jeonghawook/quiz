// src/migration/{timestamp}-SetupDefaultPostsTrigger.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupDefaultPostsTrigger1713028808307
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      console.log('intiating');
      await queryRunner.query(`
            CREATE OR REPLACE FUNCTION add_default_flashcard()
            RETURNS TRIGGER AS $$
            BEGIN
                RAISE NOTICE 'Inserting default flashcards for new category with ID: %', NEW.id;
                INSERT INTO flashcard (question, answer, categoryId) VALUES
                ('default question 1', 'default answer 1', NEW.id),
              
                RAISE NOTICE 'Default flashcards inserted for category ID: %', NEW.id;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
    
            CREATE TRIGGER trigger_after_category_creation
            AFTER INSERT ON category
            FOR EACH ROW
            EXECUTE PROCEDURE add_default_flashcard();
        `);
    } catch (error) {
      console.log(error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TRIGGER IF EXISTS trigger_after_category_creation ON category;
            DROP FUNCTION IF EXISTS add_default_flashcard;
        `);
  }
}
