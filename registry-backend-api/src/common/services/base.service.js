/**
 * Base service to handel single table operation for CRUD.
 * Please override the methods in the extended service class for multi tbale oprations
 *
 */
class BaseService {
  constructor(model) {
    this.model = model

    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.getById = this.getById.bind(this)
    this.query = this.query.bind(this)
    this.deleteByCondition = this.deleteByCondition.bind(this)
    this.findOne = this.findOne.bind(this)
  }

  async create(createDto) {
    const record = await this.model.create(createDto)
    return record
  }

  async bulkInsert(createDto) {
    const record = await this.model.bulkCreate(createDto)
    return record
  }

  async update(id, updateDto) {
    const record = await this.model.findByPk(id)

    if (record) {
      return record.update(updateDto)
    }

    return record
  }

  async getAll() {
    const record = await this.model.findAll()
    return record
  }

  async getById(id) {
    const record = await this.model.findByPk(id)
    return record
  }

  async delete(id) {
    const record = await this.model.findByPk(id)

    const obj = {}
    obj.tableName = this.model.name
    obj.isDeleted = true
    obj.recordId = id

    if (record) {
      await record.destroy()
    } else {
      obj.isDeleted = false
    }

    return obj
  }

  async query(queryDto) {
    const { count, rows } = await this.model.findAndCountAll({
      where: queryDto.where,
      order: queryDto.sort,
      offset: queryDto.paging?.offset,
      limit: queryDto.paging?.limit,
    })

    return { records: rows, totalRecords: count }
  }

  async deleteByCondition(whereCondition) {
    rows = await this.model.destroy({
      where: whereCondition,
    })

    return rows
  }

  async findOne(whereCondition) {
    rows = await this.model.destroy({
      where: whereCondition,
    })

    return rows
  }
}

module.exports = BaseService
