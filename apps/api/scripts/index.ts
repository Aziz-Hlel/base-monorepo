import { loginFlow } from './flows/login';
import { createElectiveExam } from './steps/exam/createElective';
import { getElectiveExamById } from './steps/exam/getElectiveById';
import { createMajor } from './steps/major/create';
import { getAllMajors } from './steps/major/getAll';
import { getMajorById } from './steps/major/getById';
import { getAllElectiveExams } from './steps/major/getAllElective';
import { firebaseLogin } from './steps/firebase/login';
import { serverLogin } from './steps/auth/login';
import { serverRegister } from './steps/auth/register';

export const run = async () => {
  var response;
  response = await firebaseLogin();
  //   response = await serverRegister();
  response = await serverLogin();
  //   response = await createMajor();
  //   response = await getMajorById();
  //   response = await getAllMajors();
  //   response = await createElectiveExam();
  //   response = await getElectiveExamById();
  response = await getAllElectiveExams();

  console.log('response', response);
};

run();
