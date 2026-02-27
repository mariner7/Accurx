import { DomainError } from '../../../../shared/errors/DomainError.js';

export interface ClinicalNotesProps {
  observations: string;
  diagnosis: string | null;
  treatment: string | null;
  followUp: string | null;
}

const MAX_OBSERVATIONS_LENGTH = 5000;
const MAX_FIELD_LENGTH = 1000;

export class ClinicalNotes {
  public readonly observations: string;
  public readonly diagnosis: string | null;
  public readonly treatment: string | null;
  public readonly followUp: string | null;

  constructor(props: ClinicalNotesProps) {
    this.validate(props);
    
    this.observations = props.observations.trim();
    this.diagnosis = props.diagnosis?.trim() || null;
    this.treatment = props.treatment?.trim() || null;
    this.followUp = props.followUp?.trim() || null;
  }

  private validate(props: ClinicalNotesProps): void {
    if (!props.observations || props.observations.trim() === '') {
      throw new DomainError('Observations are required');
    }

    if (props.observations.length > MAX_OBSERVATIONS_LENGTH) {
      throw new DomainError(`Observations cannot exceed ${MAX_OBSERVATIONS_LENGTH} characters`);
    }

    if (props.diagnosis && props.diagnosis.length > MAX_FIELD_LENGTH) {
      throw new DomainError(`Diagnosis cannot exceed ${MAX_FIELD_LENGTH} characters`);
    }

    if (props.treatment && props.treatment.length > MAX_FIELD_LENGTH) {
      throw new DomainError(`Treatment cannot exceed ${MAX_FIELD_LENGTH} characters`);
    }

    if (props.followUp && props.followUp.length > MAX_FIELD_LENGTH) {
      throw new DomainError(`Follow-up cannot exceed ${MAX_FIELD_LENGTH} characters`);
    }
  }

  isComplete(): boolean {
    return (
      this.observations.length > 0 &&
      this.diagnosis !== null &&
      this.treatment !== null
    );
  }

  toPlainObject(): ClinicalNotesProps {
    return {
      observations: this.observations,
      diagnosis: this.diagnosis,
      treatment: this.treatment,
      followUp: this.followUp
    };
  }
}
