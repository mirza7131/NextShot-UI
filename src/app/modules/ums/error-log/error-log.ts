import { ResourceModel } from "src/app/Repository/models/resource.model";

export class ErrorLog extends ResourceModel<ErrorLog> {
    ErrorLogId?: number;
    Message?: string;
    StackTrace?: string;
    InnerException?: string;
    Method?: string;
    Route?: string;
    RouteBase?: string;

  constructor(model?: Partial<ErrorLog>) {
    super(model);
  }
}