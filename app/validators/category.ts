import vine from '@vinejs/vine'

export const categoryValidator = vine.compile(
  vine.object({
    icon: vine.string().optional(),
    name: vine.string().minLength(3).maxLength(255),
    description: vine.string().minLength(3).maxLength(255),
    categoryType: vine.string().minLength(3).maxLength(50),
    expenseType: vine.enum(['essential', 'non-essential']),
    budget: vine.number().positive(),
    workspaceId: vine.number().positive(),
  })
)
