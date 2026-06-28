import { ResourceModel } from "src/app/Repository/models/resource.model";

export class Attachment extends ResourceModel<Attachment> {
    AttachmentId: string;
    ParentId: string;
    ParentType: string;
    Base64: string;
    constructor(model?: Partial<Attachment>) {
        super(model);
    }
}
