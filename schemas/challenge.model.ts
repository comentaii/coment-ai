import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode: string;
  testCases: {
    input: any;
    expectedOutput: any;
  }[];
  company: mongoose.Types.ObjectId; // Hangi şirkete ait olduğu
}

const ChallengeSchema: Schema<IChallenge> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    starterCode: {
      type: String,
      required: true,
    },
    testCases: [
      {
        input: Schema.Types.Mixed,
        expectedOutput: Schema.Types.Mixed,
      },
    ],
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Challenge = mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);

export { Challenge };
export default ChallengeSchema;
