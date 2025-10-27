// src/modules/projects/projects.services.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './projects.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save(); // Menyimpan ke MongoDB
  }

  // 2. UPDATE: Memperbarui Proyek
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      // ⬅️ PENYEBAB UTAMA ERROR: Anda mungkin lupa ini
      .exec(); // <--- TAMBAHKAN ATAU PASTIKAN .exec() ADA DI SINI

    if (!updatedProject) {
      throw new NotFoundException(
        `Project with ID "${id}" not found for update.`,
      );
    }

    return updatedProject;
  }


  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  // 4. READ ONE: Mengambil Proyek berdasarkan ID
  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).exec();

    // Penanganan Error: Jika ID tidak ditemukan, throw 404
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  // 5. DELETE: Menghapus Proyek
  async remove(id: string): Promise<any> {
    const result = await this.projectModel.findByIdAndDelete(id).exec();

    // Penanganan Error
    if (!result) {
      throw new NotFoundException(
        `Project with ID ${id} not found for deletion`,
      );
    }
    return {
      message: `Project with ID ${id} successfully deleted`,
      deletedCount: 1,
    };
  }
}
