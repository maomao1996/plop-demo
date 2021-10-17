const fs = require('fs-extra')
const dayjs = require('dayjs')
const changeCase = require('change-case')

// 获取当前时间的年月日信息
const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

module.exports = function (plop) {
  plop.setGenerator('page', {
    description: '基础页面生成',
    prompts: [
      {
        type: 'list',
        message: '请选择创建类型:',
        name: 'type',
        choices: [
          {
            name: '页面',
            value: {
              name: '页面',
              value: 'pages'
            }
          },
          {
            name: '组件',
            value: {
              name: '组件',
              value: 'components'
            }
          }
        ]
      },
      {
        type: 'input',
        name: 'fileName',
        message: '组件/页面名:',
        filter(value) {
          return value.replace(/\s+/g, '')
        },
        validate(value, { type }) {
          const name = type.name
          const done = this.async()
          if (!value) {
            done(`请输入${name}名`)
            return
          }
          if (!/^[a-zA-Z0-9_-]{4,}$/.test(value)) {
            done(`${name}名格式不正确`)
            return
          }

          value = type.value === 'components' ? changeCase.pascalCase(value) : value

          if (fs.existsSync(`${process.cwd()}/src/${type.value}/${value}/index.jsx`)) {
            done(`${name}已存在`)
            return
          }
          done(null, true)
        }
      },
      {
        type: 'confirm',
        name: 'style',
        message: '是否需要样式文件?',
        default: false
      }
    ],
    actions(data) {
      const { type, style } = data

      const isPages = type.value === 'pages'

      const actions = [
        // 添加 JS 文件
        {
          type: 'add',
          path: isPages
            ? 'src/pages/{{kebabCase fileName}}/index.jsx'
            : 'src/components/{{pascalCase fileName}}/index.jsx',
          templateFile: `plop-templates/{{type.value}}/index.hbs`
        },
        // 修改路由 / 组件配置
        {
          type: 'modify',
          path: isPages ? 'src/routes/index.jsx' : 'src/components/index.jsx',
          pattern: /(\/\* plop add \*\/)/g,
          templateFile: `plop-templates/{{type.value}}/add.hbs`,
          data: {
            createTime: currentTime
          }
        }
      ]

      // 添加样式文件
      if (style) {
        actions.push({
          type: 'add',
          path: isPages
            ? 'src/pages/{{kebabCase fileName}}/index.scss'
            : 'src/components/{{pascalCase fileName}}/index.scss',
          templateFile: `plop-templates/{{type.value}}/style.hbs`
        })
      }

      return actions
    }
  })
}
