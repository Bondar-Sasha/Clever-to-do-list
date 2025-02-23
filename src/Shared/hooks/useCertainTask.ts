import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../config/firebase';
import { TaskResponse } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../api';

interface UseCertainTask {
  taskId?: string;
}

interface UseCertainTaskResponse {
  data: TaskResponse | null;
  isFetching: boolean;
}

export const useCertainTask = ({
  taskId,
}: UseCertainTask): UseCertainTaskResponse => {
  const [user] = useAuthState(auth);
  const [value, isFetching] = useCollection(
    taskId && user
      ? query(
          collection(db, 'task'),
          where('id', '==', taskId),
          where('user', '==', user.uid)
        )
      : null
  );

  if (!value || value.docs.length === 0) {
    return { data: null, isFetching };
  }

  const taskData = value.docs[0].data() as TaskResponse;

  return { data: taskData, isFetching };
};