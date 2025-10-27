import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Put,
  Param,
  Delete
} from '@nestjs/common';
import { ProjectsService } from './projects.services';
import { CreateProjectDto } from './dto/create-project.dto'; // Import DTO
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Tambahkan metode GET untuk menguji rute dasar
  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED) // Mengembalikan status 201 (Created)
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }


  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.OK) 
  async deleteProject(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
