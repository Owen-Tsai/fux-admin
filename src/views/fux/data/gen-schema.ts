import { cloneDeep, kebabCase } from 'lodash-es'
import { generateId } from '@fusionx/core/utils'
import { getCodeGenConfigDetail, type ConfigDetailVO } from '@/api/infra/code-gen'
import { initialWidgetConfig } from '@fusionx/core/utils'
import type { AppSchemaGenerationInfo, FormSchema, Widget, WidgetMap } from '@fusionx/core/types'

/**
 * 生成单个字段的 schema
 * @param config 字段的配置
 * @param tableName 表名，不传入时生成的字段 name 将不含表名和冒号构成的前缀
 */
const genFieldSchema = (column: ConfigDetailVO['columns'][number], tableName?: string) => {
  const type = (column.htmlType === 'datetime' ? 'datePicker' : column.htmlType) as keyof WidgetMap
  if (initialWidgetConfig[type]) {
    const ret = {
      ...cloneDeep(initialWidgetConfig[type]!),
      uid: generateId(),
      props: {
        ...cloneDeep(initialWidgetConfig[type]!.props),
        field: {
          label: column.columnComment || column.columnName,
          name: tableName ? `${tableName}:${column.javaField}` : column.javaField,
        },
        hide: `${column.javaField}` == 'id',
      },
    }

    if (
      column.htmlType &&
      ['select', 'checkbox', 'radio'].includes(column.htmlType) &&
      column.dictTypeStr
    ) {
      ;(ret as WidgetMap['select' | 'radio' | 'checkbox']).props.options.type = 'dict'
      ;(ret as WidgetMap['select' | 'radio' | 'checkbox']).props.options.value = column.dictTypeStr
    }

    delete ret.icon

    return ret as Widget
  }
}

/**
 * 生成 DataTable 组件的 schema
 * @param info DataTable 对应的子表的配置信息
 * @param widgets 子表表单中包含的字段的 schema
 */
const genDataTableSchema = (info: ConfigDetailVO, widgets: Widget[]): WidgetMap['dataTable'] => {
  // columns that should be listed in table mode
  const columns = info.columns.filter((column) => column.listOperation)

  const ret: WidgetMap['dataTable'] = {
    ...cloneDeep(initialWidgetConfig.dataTable)!,
    uid: generateId(),
    props: {
      ...cloneDeep(initialWidgetConfig.dataTable!.props),
      widgets: widgets,
      columns: columns.map((column) => ({
        key: column.javaField,
        title: column.columnComment || column.columnName,
        dataIndex: column.javaField,
        formatter: {
          type: column.dictTypeStr ? 'dict' : '',
          value: column.dictTypeStr || '',
        },
      })),
      url: '/applications/' + kebabCase(info.table.tableName),
    },
  }

  ret.props.columns?.push({
    key: 'actions',
    title: '操作',
    formatter: { type: '', value: '' },
  })

  delete ret.icon

  return ret
}

/**
 * 生成栅格布局组件 Grid 的 schema
 * @param count 栅格布局组件的默认分列数量，取值 2 或 3
 * @param widgets 栅格布局组件中包含的字段的 schema
 */
const genGridSchema = (count: 2 | 3, widgets: Widget[]): WidgetMap['grid'] => {
  const cols: Array<Widget[]> = []

  widgets.forEach((widget, idx) => {
    for (let i = 0; i < count; i++) {
      if (idx % count === i) {
        if (!cols[i]) cols[i] = []
        cols[i].push(widget)
      }
    }
  })

  const ret: WidgetMap['grid'] = {
    ...cloneDeep(initialWidgetConfig.grid)!,
    uid: generateId(),
    props: {
      ...cloneDeep(initialWidgetConfig.grid!.props),
    },
  }

  ret.props.children = cols.map((col) => ({
    span: 12 / count,
    widgets: col,
  }))

  return ret
}

/**
 * 生成一个数据表中包含的字段的 schema
 * @param info 表的配置信息
 */
const genTableFieldsSchema = (
  tableConfig: ConfigDetailVO,
  appInfo: AppSchemaGenerationInfo,
): Widget[] => {
  const { columns } = tableConfig
  const ret: Widget[] = []

  columns.forEach((column) => {
    // if a field is not intended to be filled by user, ignore
    if (!column.createOperation || !column.htmlType) return

    const isSubTable = !!appInfo.tables.find((t) => t.name === tableConfig.table.tableName)
      ?.isSubTable

    const widget = isSubTable
      ? genFieldSchema(column)
      : genFieldSchema(column, tableConfig.table.tableName)
    if (widget) {
      ret.push(widget)
    }
  })

  return ret
}

const genAppFormSchema = async (info: AppSchemaGenerationInfo): Promise<FormSchema> => {
  const { gridColumns, paginated, tables } = info

  const tableColumnsInfo: ConfigDetailVO[] = []

  for (const table of tables) {
    const resp = await getCodeGenConfigDetail(table.id as number)
    tableColumnsInfo.push(resp)
  }

  const schemaWrapper: Widget | Widget[] = paginated
    ? ({
        ...cloneDeep(initialWidgetConfig[paginated]!),
        uid: generateId(),
        props: {
          ...cloneDeep(initialWidgetConfig[paginated]!.props),
          children: [],
        },
      } as Widget)
    : []

  tableColumnsInfo.forEach((tableConfig) => {
    const gridSchema: WidgetMap['grid'] | null = gridColumns
      ? {
          ...cloneDeep(initialWidgetConfig.grid)!,
          uid: generateId(),
          props: {
            ...cloneDeep(initialWidgetConfig.grid!.props),
            children: [],
          },
        }
      : null

    delete gridSchema?.icon

    let tableSchema: Widget[] = genTableFieldsSchema(tableConfig, info)
    if (gridColumns) {
      // const colWidgets = genGridSchema(tableSchema, column)
      const gridSchema = genGridSchema(gridColumns, tableSchema)

      tableSchema = [gridSchema]
    }

    if (tables.find((table) => table.id === tableConfig.table.id)?.isSubTable) {
      if (paginated) {
        tableSchema = genTableFieldsSchema(tableConfig, info)
        if (gridColumns) {
          // const colWidgets = genGridSchema(tableSchema, column)
          const gridSchema = genGridSchema(gridColumns, tableSchema)

          tableSchema = [gridSchema]
        }
        ;(schemaWrapper as WidgetMap['tabs' | 'steps']).props.children.push({
          title: tableConfig.table.tableComment || tableConfig.table.tableName || '',
          widgets: [genDataTableSchema(tableConfig, tableSchema)],
        })
      } else {
        ;(schemaWrapper as Widget[]).push({
          ...cloneDeep(initialWidgetConfig.subForm!),
          uid: generateId(),
          props: {
            ...cloneDeep(initialWidgetConfig.subForm!.props),
            field: {
              label: tableConfig.table.tableComment || tableConfig.table.tableName || '',
              name: tableConfig.table,
            },
            children: [...tableSchema],
          },
        } as WidgetMap['subForm'])
      }
    } else {
      if (paginated) {
        ;(schemaWrapper as WidgetMap['tabs' | 'steps']).props.children.push({
          title: tableConfig.table.tableComment || tableConfig.table.tableName || '',
          widgets: tableSchema,
        })

        delete (schemaWrapper as WidgetMap['tabs' | 'steps']).icon
      } else {
        ;(schemaWrapper as Widget[]).push(...tableSchema)
      }
    }
  }) // forEach

  return {
    widgets: Array.isArray(schemaWrapper) ? [...schemaWrapper] : [schemaWrapper],
    layout: info.gridColumns === 3 ? 'vertical' : 'horizontal',
    labelWidth: info.gridColumns === 3 ? undefined : '100px',
    colon: info.gridColumns !== 3,
    labelAlign: info.gridColumns === 3 ? undefined : 'right',
  }
}

export default genAppFormSchema
