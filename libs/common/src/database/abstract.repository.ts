import { Logger, NotFoundException } from "@nestjs/common";
import { Connection, FilterQuery, Model, ProjectionElementType, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";

export type Projection<T> = { [P in keyof T]?: ProjectionElementType };

export abstract class AbstractRepository<T extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<T>,
    private readonly connection: Connection
  ) {}

  async findOne(filterQuery: FilterQuery<T>, projection?: Projection<T>) {
    const doc = await this.model.findOne(filterQuery, projection, { lean: true });

    if (!doc) {
      this.logger.warn("Document not found with filterQuery:", filterQuery);
      throw new NotFoundException("Document not found");
    }

    return doc;
  }

  async find(filterQuery: FilterQuery<T>, projection?: Projection<T>) {
    return this.model.find(filterQuery, projection, { lean: true });
  }

  async create(createEntityData: Omit<Partial<T>, "__id">) {
    const entity = new this.model({ _id: new Types.ObjectId(), ...createEntityData });
    return (await entity.save()).toJSON();
  }

  async findOneAndUpdate(filterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<T>) {
    const doc = await this.model.findOneAndUpdate(filterQuery, updateEntityData, { new: true, lean: true });

    if (!doc) {
      this.logger.warn("Document not found with filterQuery:", filterQuery);
      throw new NotFoundException("Document not found");
    }

    return doc;
  }

  async upsert(filterQuery: FilterQuery<T>, doc: Partial<T>) {
    return this.model.findOneAndUpdate(filterQuery, doc, { lean: true, upsert: true, new: true });
  }

  async deleteMany(filterQuery: FilterQuery<T>) {
    const delRes = await this.model.deleteMany(filterQuery);
    return delRes.deletedCount > 0;
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
