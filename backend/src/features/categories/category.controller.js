import { CategoryModel } from './category.model.js'

export const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.findAll()
    res.json(categories)
  } catch (err) {
    next(err)
  }
}
