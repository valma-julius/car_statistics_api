import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';
export declare class ReportsService {
    private repo;
    constructor(repo: Repository<Report>);
    create(reportDto: CreateReportDto, user: User): Promise<Report>;
    changeApproval(id: string, approved: boolean): Promise<Report>;
    createEstimate({ make, model, lng, lat, year, mileage, }: GetEstimateDto): Promise<any>;
}
