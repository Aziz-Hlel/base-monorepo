import { prisma } from '@/bootstrap/db.init';
import { ConflictError, NotFoundError } from '@/err/customErrors';
import { CreateClassRequest } from '@repo/contracts/schemas/class/createClassRequest';
import { UpdateClassRequest } from '@repo/contracts/schemas/class/updateClassRequest';
import { ClassRepo } from './class.repo';
import { ClassMapper } from './class.mapper';

export class ClassService {
  constructor(private readonly classRepo: ClassRepo) {}

  create = async (data: CreateClassRequest, schoolId: string) => {
    const existingClass = await prisma.class.findUnique({
      where: { schoolId_name: { name: data.name, schoolId } },
      select: { id: true },
    });
    if (existingClass) throw new ConflictError('Class already exists');

    const newClass = await prisma.class.create({ data: { ...data, schoolId } });
    const classResponse = ClassMapper.toResponse(newClass);
    return classResponse;
  };

  getBySchoolId = async (schoolId: string) => {
    const classes = await this.classRepo.getBySchoolId(schoolId);
    const classResponses = classes.map((cls) => ClassMapper.toResponse(cls));
    return classResponses;
  };

  getById = async (id: string) => {
    const cls = await this.classRepo.getById(id);
    if (!cls) throw new NotFoundError('Class not found');
    const classResponse = ClassMapper.toResponse(cls);
    return classResponse;
  };

  update = async (data: UpdateClassRequest, schoolId: string, classId: string) => {
    const newName = data.name;
    const existingClass = await prisma.class.findUnique({
      where: { schoolId_name: { name: newName, schoolId } },
      select: { id: true },
    });
    if (existingClass) throw new ConflictError('Class already exists');

    const updatedClass = await this.classRepo.update(data, classId);
    const classResponse = ClassMapper.toResponse(updatedClass);
    return classResponse;
  };

  delete = async (id: string) => {
    return await this.classRepo.delete(id);
  };
}
