import { CreateReportDto } from './dtos/create-report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportsService } from './reports.service';
import { User } from '../users/user.entity';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    createReport(body: CreateReportDto, user: User): Promise<import("./report.entity").Report>;
    approveReports(id: string, body: ApproveReportDto): Promise<import("./report.entity").Report>;
    getEstimate(query: GetEstimateDto): Promise<any>;
}
