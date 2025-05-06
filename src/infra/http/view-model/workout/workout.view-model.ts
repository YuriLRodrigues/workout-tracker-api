import { Workout } from 'src/domain/enterprise/value-object/workout';

export class WorkoutViewModel {
  static toHttp(data: Workout) {
    return {
      id: data.id.toValue(),
      userId: data.userId.toValue(),
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      totalExercises: data.totalExercises,
      totalSets: data.totalSets,
      totalRepetitions: data.totalRepetitions,
      bannerUrl: data?.bannerUrl || undefined,
      bannerBlurHash: data?.bannerBlurHash || undefined,
      createdAt: data.createdAt,
      updatedAt: data?.updatedAt || undefined,
    };
  }
}
