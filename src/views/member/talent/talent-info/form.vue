<template>
  <AModal v-model:open="visible" :title="''" :footer="null" :closable="true" width="800px">
    <ASpin :spinning="loading">
      <div class="view-form mt-4">
        <div class="card-header">
          <div class="title-container">
            <UserOutlined class="title-icon" />
            <h2 class="card-title">{{ formData.name || '人才信息' }}</h2>
            <div class="card-subtitle">
              {{
                [
                  getDictLabel(RC_EDUCATION_LEVEL, formData.diploma),
                  getDictLabel(USER_SEX, formData.sex),
                  getAgeFromIdCard(formData.idcard),
                ]
                  .filter(Boolean)
                  .join(' · ')
              }}
            </div>
          </div>
        </div>
        <ATabs defaultActiveKey="basic" class="form-tabs">
          <ATabPane tab="基础信息" key="basic">
            <!-- 基础信息表格 -->
            <div class="form-section">
              <!-- <h3 class="section-title">基础信息</h3> -->
              <table class="talent-table">
                <tbody>
                  <tr>
                    <td class="label-cell">用户名</td>
                    <td class="value-cell">{{ formData.username }}</td>
                    <td class="label-cell">编码</td>
                    <td class="value-cell">{{ formData.code }}</td>
                  </tr>
                  <!-- <tr>
                <td class="label-cell">姓名</td>
                <td class="value-cell">{{ formData.name }}</td>
                <td class="label-cell">性别</td>
                <td class="value-cell">{{ getDictLabel(USER_SEX, formData.sex) }}</td>
              </tr> -->
                  <tr>
                    <td class="label-cell">身份证号</td>
                    <td class="value-cell">{{ formData.idcard }}</td>
                    <td class="label-cell">出生年月</td>
                    <td class="value-cell">
                      {{
                        formData.birthday
                          ? dayjs(Number(formData.birthday)).format('YYYY-MM-DD')
                          : ''
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="label-cell">证件类型</td>
                    <td class="value-cell">{{ getDictLabel(IDENTITY_TYPE, formData.idtype) }}</td>
                    <td class="label-cell">英文名</td>
                    <td class="value-cell">{{ formData.englishname }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">学历</td>
                    <td class="value-cell">
                      {{ getDictLabel(RC_EDUCATION_LEVEL, formData.diploma) }}
                    </td>
                    <td class="label-cell">学历类型</td>
                    <td class="value-cell">
                      {{ getDictLabel(RC_EDUCATION_TYPE, formData.diplomatype) }}
                    </td>
                  </tr>
                  <!-- <tr>
                <td class="label-cell">身高</td>
                <td class="value-cell">{{ formData.height }}</td>
                <td class="label-cell">体重</td>
                <td class="value-cell">{{ formData.weight }}</td>
              </tr> -->
                  <tr>
                    <td class="label-cell">联系电话</td>
                    <td class="value-cell">{{ formData.mobile }}</td>
                    <td class="label-cell">地址</td>
                    <td class="value-cell">{{ formData.address }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">民族</td>
                    <td class="value-cell">
                      {{ getDictLabel(USER_NATION_TEST, formData.nation) }}
                    </td>
                    <td class="label-cell">政治面貌</td>
                    <td class="value-cell">
                      {{ getDictLabel(USER_POLITICAL, formData.politicalstatus) }}
                    </td>
                  </tr>
                  <tr>
                    <!-- <td class="label-cell">出生地</td>
                <td class="value-cell">{{ formData.nativeplace }}</td> -->
                    <td class="label-cell">婚姻状况</td>
                    <td class="value-cell">
                      {{ getDictLabel(RC_MARRIAGE, formData.maritalstatus) }}
                    </td>
                    <td class="label-cell">email</td>
                    <td class="value-cell">{{ formData.email }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">自我介绍</td>
                    <td class="value-cell" colspan="3">{{ formData.selfeval }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">备注</td>
                    <td class="value-cell" colspan="3">{{ formData.remark }}</td>
                  </tr>

                  <!-- <tr>
                <td class="label-cell">注册公民</td>
                <td class="value-cell">{{ formData.registeredresidence }}</td>
                <td class="label-cell">手机号</td>
                <td class="value-cell">{{ formData.mobile }}</td>
              </tr> -->

                  <tr>
                    <td class="label-cell">是否可用</td>
                    <td class="value-cell">{{ getDictLabel(YES_NO, formData.isenable) }}</td>
                    <td class="label-cell">注册时间</td>
                    <td class="value-cell">
                      {{
                        formData.regdate ? dayjs(Number(formData.regdate)).format('YYYY-MM-DD') : ''
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="label-cell">最后登录IP</td>
                    <td class="value-cell">{{ formData.lastlogonip }}</td>
                    <td class="label-cell">最后登录时间</td>
                    <td class="value-cell">
                      {{
                        formData.lastlogondate
                          ? dayjs(Number(formData.lastlogondate)).format('YYYY-MM-DD HH:mm:ss')
                          : ''
                      }}
                    </td>
                  </tr>

                  <tr>
                    <!-- <td class="label-cell">邮编</td>
                <td class="value-cell">{{ formData.postcode }}</td> -->
                  </tr>
                </tbody>
              </table>
            </div>
          </ATabPane>
          <ATabPane tab="学习经历" key="education">
            <div class="form-section">
              <template v-for="(item, index) in formData.educationList.slice(0, 5)" :key="index">
                <table class="talent-table" :class="index > 0 ? 'mt-4' : ''">
                  <tbody>
                    <tr>
                      <td class="label-cell">毕业院校</td>
                      <td class="value-cell" colspan="3">{{ item.schoolName }}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">专业</td>
                      <td class="value-cell">{{ item.major }}</td>
                      <td class="label-cell">学历</td>
                      <td class="value-cell">
                        {{ getDictLabel(RC_EDUCATION_LEVEL, Number(item.educationLevel)) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">入学时间</td>
                      <td class="value-cell">
                        {{ item.startDate ? dayjs(Number(item.startDate)).format('YYYY-MM') : '' }}
                      </td>
                      <td class="label-cell">毕业时间</td>
                      <td class="value-cell">
                        {{ item.endDate ? dayjs(Number(item.endDate)).format('YYYY-MM') : '' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
          </ATabPane>
          <ATabPane tab="工作经历" key="work">
            <div class="form-section">
              <template v-for="(item, index) in formData.workList.slice(0, 5)" :key="index">
                <table class="talent-table" :class="index > 0 ? 'mt-4' : ''">
                  <tbody>
                    <tr>
                      <td class="label-cell">公司名称</td>
                      <td class="value-cell" colspan="3">{{ item.companyName }}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">职位</td>
                      <td class="value-cell">{{ item.position }}</td>
                      <td class="label-cell">部门</td>
                      <td class="value-cell">{{ item.department }}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">入职时间</td>
                      <td class="value-cell">
                        {{ item.startDate ? dayjs(Number(item.startDate)).format('YYYY-MM') : '' }}
                      </td>
                      <td class="label-cell">离职时间</td>
                      <td class="value-cell">
                        {{ item.endDate ? dayjs(Number(item.endDate)).format('YYYY-MM') : '' }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">工作内容描述</td>
                      <td class="value-cell" colspan="3">{{ item.jobDescription }}</td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
          </ATabPane>
          <ATabPane tab="技能等级" key="skills">
            <div class="form-section">
              <template v-for="(item, index) in formData.skillList" :key="index">
                <table class="talent-table" :class="index > 0 ? 'mt-4' : ''">
                  <tbody>
                    <tr>
                      <td class="label-cell">技能名称</td>
                      <td class="value-cell">{{ item.skillName }}</td>
                      <td class="label-cell">等级</td>
                      <td class="value-cell">
                        {{ getDictLabel(PERSONAL_SKILL_LEVEL, Number(item.skillLevel)) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">技能描述</td>
                      <td class="value-cell" colspan="3">{{ item.skillDescription }}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">证书编号</td>
                      <td class="value-cell" colspan="3">{{ item.certificateNo }}</td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
          </ATabPane>
          <ATabPane tab="专利信息" key="patents">
            <div class="form-section">
              <template v-for="(item, index) in formData.patentList" :key="index">
                <table class="talent-table" :class="index > 0 ? 'mt-4' : ''">
                  <tbody>
                    <tr>
                      <td class="label-cell">专利名称</td>
                      <td class="value-cell">{{ item.patentName }}</td>
                      <td class="label-cell">专利类型</td>
                      <td class="value-cell">
                        {{ getDictLabel(PATENT_TYPE, Number(item.patentType)) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="label-cell">专利号</td>
                      <td class="value-cell">{{ item.patentNo }}</td>
                      <td class="label-cell">授权日期</td>
                      <td class="value-cell">
                        {{
                          item.authorizationDate
                            ? dayjs(Number(item.authorizationDate)).format('YYYY-MM')
                            : ''
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
          </ATabPane>
          <ATabPane tab="荣誉奖项" key="honors">
            <div class="form-section">
              <template v-for="(item, index) in formData.honorList.slice(0, 5)" :key="index">
                <table class="talent-table" :class="index > 0 ? 'mt-4' : ''">
                  <tbody>
                    <tr>
                      <td class="label-cell">荣誉名称</td>
                      <td class="value-cell" colspan="3">{{ item.awardName }}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">颁发机构</td>
                      <td class="value-cell">{{ item.awardingOrganization }}</td>
                      <td class="label-cell">颁发日期</td>
                      <td class="value-cell">
                        {{ item.awardDate ? dayjs(Number(item.awardDate)).format('YYYY-MM') : '' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
          </ATabPane>
          <ATabPane tab="著作信息" key="works">
            <div class="form-section">
              <template v-for="(item, index) in formData.publicationList" :key="index">
                <table class="talent-table" :class="index > 0 ? 'mt-4' : ''">
                  <tbody>
                    <tr>
                      <td class="label-cell">著作名称</td>
                      <td class="value-cell" colspan="3">{{ item.title }}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">摘要</td>
                      <td class="value-cell" colspan="3">{{ item.abstractContent }}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">关键词</td>
                      <td class="value-cell" colspan="3">{{ item.keywords }}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">期刊名称</td>
                      <td class="value-cell">{{ item.journalName }}</td>
                      <td class="label-cell">出版日期</td>
                      <td class="value-cell">
                        {{
                          item.publishDate
                            ? dayjs(Number(item.publishDate)).format('YYYY-MM-DD')
                            : ''
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
          </ATabPane>
          <ATabPane tab="职称信息" key="professionalTitles">
            <div class="form-section">
              <template v-for="(item, index) in formData.titleList" :key="index">
                <table class="talent-table" :class="index > 0 ? 'mt-4' : ''">
                  <tbody>
                    <tr>
                      <td class="label-cell">职称名称</td>
                      <td class="value-cell">{{ item.titleName }}</td>
                      <td class="label-cell">评定机构</td>
                      <td class="value-cell">{{ item.issuingAuthority }}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">证书编号</td>
                      <td class="value-cell">{{ item.certificateNo }}</td>
                      <td class="label-cell">评定日期</td>
                      <td class="value-cell">
                        {{
                          item.obtainDate ? dayjs(Number(item.obtainDate)).format('YYYY-MM-DD') : ''
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </div>
          </ATabPane>
        </ATabs>

        <!-- 其他信息表格 ，暂不显示 -->
        <div class="form-section" v-if="false">
          <h3 class="section-title">其他信息</h3>
          <table class="talent-table">
            <tbody>
              <tr>
                <td class="label-cell">工作经验</td>
                <td class="value-cell">{{ formData.jobexperience }}</td>
                <td class="label-cell">打电话时间</td>
                <td class="value-cell">
                  {{
                    formData.calltime ? dayjs(Number(formData.calltime)).format('YYYY-MM-DD') : ''
                  }}
                </td>
              </tr>
              <tr>
                <td class="label-cell">qq</td>
                <td class="value-cell">{{ formData.qq }}</td>
                <td class="label-cell">个人主页</td>
                <td class="value-cell">{{ formData.homepage }}</td>
              </tr>
              <tr>
                <td class="label-cell">毕业院校</td>
                <td class="value-cell">{{ formData.eduschool }}</td>
                <td class="label-cell">毕业时间</td>
                <td class="value-cell">
                  {{ formData.edudate ? dayjs(Number(formData.edudate)).format('YYYY-MM-DD') : '' }}
                </td>
              </tr>
              <tr>
                <td class="label-cell">第一专业</td>
                <td class="value-cell">{{ formData.firstmajor }}</td>
                <td class="label-cell">第二专业</td>
                <td class="value-cell">{{ formData.secondmajor }}</td>
              </tr>
              <tr>
                <td class="label-cell">中文水平</td>
                <td class="value-cell">{{ formData.chineselevel }}</td>
                <td class="label-cell">第一外语</td>
                <td class="value-cell">{{ formData.firstlang }}</td>
              </tr>
              <tr>
                <td class="label-cell">第一外语等级</td>
                <td class="value-cell">{{ formData.foreignlanglevel }}</td>
                <td class="label-cell">第二外语</td>
                <td class="value-cell">{{ formData.secondlang }}</td>
              </tr>
              <tr>
                <td class="label-cell">第二外语等级</td>
                <td class="value-cell">{{ formData.foreignlanglevel2 }}</td>
                <td class="label-cell">证书</td>
                <td class="value-cell">{{ formData.certificate }}</td>
              </tr>
              <tr>
                <td class="label-cell">头衔</td>
                <td class="value-cell">{{ formData.titlelevel }}</td>
                <td class="label-cell">个人能力</td>
                <td class="value-cell">{{ formData.abilitydesc }}</td>
              </tr>
              <tr>
                <td class="label-cell">工作状态</td>
                <td class="value-cell">
                  {{ getDictLabel(PERSONAL_WORK_STATUS, formData.jobstate) }}
                </td>
              </tr>
              <tr>
                <td class="label-cell">工作场所</td>
                <td class="value-cell">{{ formData.hopeworkplace }}</td>
                <td class="label-cell">头像上传Id</td>
                <td class="value-cell">{{ formData.photoattach }}</td>
              </tr>
              <tr>
                <td class="label-cell">身份证上传Id</td>
                <td class="value-cell">{{ formData.idcardattach }}</td>
                <td class="label-cell">证书上传Id</td>
                <td class="value-cell">{{ formData.certificateattach }}</td>
              </tr>
              <tr>
                <td class="label-cell">关键字</td>
                <td class="value-cell">{{ formData.keywords }}</td>
                <td class="label-cell">审核状态</td>
                <td class="value-cell">{{ formData.auditstate }}</td>
              </tr>
              <!-- <tr>
                <td class="label-cell">登录时间</td>
                <td class="value-cell">{{ formData.logontimes }}</td>
              </tr> -->

              <tr>
                <td class="label-cell">是否推荐</td>
                <td class="value-cell">{{ getDictLabel(YES_NO, formData.isrecommend) }}</td>
                <td class="label-cell">是否接收邮件</td>
                <td class="value-cell">{{ getDictLabel(YES_NO, formData.isreceivemail) }}</td>
              </tr>
              <tr>
                <td class="label-cell">技术等级</td>
                <td class="value-cell">
                  {{ getDictLabel(PERSONAL_SKILL_LEVEL, formData.technicalgrade) }}
                </td>
                <td class="label-cell">单位Id</td>
                <td class="value-cell">{{ formData.companyid }}</td>
              </tr>
              <tr>
                <td class="label-cell">个人状态</td>
                <td class="value-cell">{{ formData.personstate }}</td>
                <td class="label-cell">人才类别</td>
                <td class="value-cell">
                  {{ getDictLabel(SYSTEM_TALENTTYPE, formData.talentstype) }}
                </td>
              </tr>
              <tr>
                <td class="label-cell">学位</td>
                <td class="value-cell">{{ formData.degree }}</td>
                <td class="label-cell">现居住地</td>
                <td class="value-cell">{{ formData.nowaddress }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import { getDetail, type TalentInfoVO } from '@/api/member/talent/talent-info'
import { message } from 'ant-design-vue'
import logger from '@/utils/logger'
import useDict from '@/hooks/use-dict'
import dayjs from 'dayjs'
import { ref, getCurrentInstance, reactive } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'

// 获取全局属性
const { proxy } = getCurrentInstance()
const $message = proxy?.$message

const visible = ref(false)
const loading = ref(false)
const formData = ref<TalentInfoVO>({})

// 资历信息静态数据
const qualificationData = reactive({
  education: [
    {
      id: '1002',
      idcard: '371311199201074481',
      schoolName: '北京大学',
      educationLevel: '6',
      major: '软件工程',
      startDate: 1409500800000,
      endDate: 1498752000000,
      remark: '硕士毕业',
    },
    {
      id: '1001',
      idcard: '371311199201074481',
      schoolName: '山东大学',
      educationLevel: '5',
      major: '计算机科学与技术',
      startDate: 1283270400000,
      endDate: 1404057600000,
      remark: '本科毕业',
    },
  ],
  work: [
    {
      company: '科技有限公司',
      position: '高级工程师',
      department: '研发部',
      startDate: '2014-07',
      endDate: '至今',
    },
    {
      company: '互联网公司',
      position: '软件工程师',
      department: '技术部',
      startDate: '2017-07',
      endDate: '2020-06',
    },
  ],
  skills: [
    { name: 'Java开发', level: '高级', certificate: 'Oracle认证专家' },
    { name: '前端开发', level: '中级', certificate: 'Web前端工程师' },
    { name: '数据库设计', level: '高级', certificate: 'MySQL认证专家' },
  ],
  patents: [
    { name: '一种分布式计算方法', patentNo: 'ZL202010123456.7', authDate: '2022-05-18' },
    { name: '一种高效的数据存储方法', patentNo: 'ZL202110345678.9', authDate: '2023-03-15' },
  ],
  honors: [
    { name: '优秀员工', issuer: '科技有限公司', issueDate: '2021-12-20' },
    { name: '技术创新奖', issuer: '行业协会', issueDate: '2022-09-10' },
  ],
  works: [
    { name: 'Java编程实战', publisher: '技术出版社', publishDate: '2020-03-15' },
    { name: '分布式系统设计', publisher: '电子工业出版社', publishDate: '2022-08-20' },
  ],
  professionalTitles: [
    { name: '高级工程师', issuer: '工业和信息化部', issueDate: '2019-10-08', validUntil: '长期' },
    {
      name: '系统架构师',
      issuer: '中国软件协会协会',
      issueDate: '2021-12-01',
      validUntil: '2026-11-30',
    },
  ],
})

const [
  IDENTITY_TYPE,
  USER_SEX,
  RC_MARRIAGE,
  RC_NATION,
  RC_POLITIC,
  RC_EDUCATION_TYPE,
  USER_NATION_TEST,
  USER_POLITICAL,
  RC_EDUCATION_LEVEL,
  PERSONAL_WORK_STATUS,
  YES_NO,
  PERSONAL_SKILL_LEVEL,
  SYSTEM_TALENTTYPE,
  PATENT_TYPE,
] = useDict(
  'identity_type',
  'user_sex',
  'rc_marriage',
  'rc_nation',
  'rc_politic',
  'rc_education_type',
  'user_nation_test',
  'user_political',
  'rc_education_level',
  'personal_work_status',
  'yes_no',
  'personal_skill_level',
  'system_talenttype',
  'patent_type',
)

// 根据字典值获取标签
const getDictLabel = (dict, value) => {
  if (!dict || !value) return ''
  const item = dict.find((item) => item.value === value)
  return item ? item.label : ''
}

// 从身份证号计算年龄
const getAgeFromIdCard = (idcard: string) => {
  if (!idcard || idcard.length !== 18) return ''

  const birthYear = parseInt(idcard.substring(6, 10))
  const birthMonth = parseInt(idcard.substring(10, 12))
  const birthDay = parseInt(idcard.substring(12, 14))

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  let age = currentYear - birthYear

  // 如果当前月份小于出生月份，或者月份相同但日期小于出生日期，年龄减1
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--
  }

  return age > 0 ? `${age}岁` : ''
}

const loadData = async (id: number) => {
  loading.value = true
  try {
    const res = await getDetail(id)
    formData.value = res
  } catch (e) {
    logger.error(import.meta.url, '加载数据失败。', e)
    $message?.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const open = (id: number) => {
  if (id) {
    loadData(id)
  }
  visible.value = true
}

defineExpose({ open })
</script>

<style scoped>
.view-form {
  padding: 16px;
}

.card-header {
  padding: 4px;
  background-color: #e6f7ff;
  border-bottom: 1px solid #bae7ff;
  display: flex;
  justify-content: center;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.card-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0050b3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-right: 12px;
}

.title-icon {
  font-size: 24px;
  color: #1890ff;
  margin-right: 8px;
  vertical-align: middle;
  transition: color 0.3s ease;
}

.title-container:hover .title-icon {
  color: #0050b3;
  transform: scale(1.1);
  transition: all 0.3s ease;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.title-container:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.card-subtitle {
  margin: 0;
  font-size: 14px;
  color: #0050b3;
  display: flex;
  align-items: center;
}
.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
}
.section-title {
  padding: 12px 16px 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2329;
  position: relative;
  display: flex;
  align-items: center;
}
.section-title::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #1890ff;
  border-radius: 50%;
}

.talent-table {
  width: 100%;
  border-collapse: collapse;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  border-top: 1px solid #e8e8e8;
}
.talent-table tr {
  border-bottom: 1px solid #e8e8e8;
}
.talent-table tr:last-child {
  border-bottom: none;
}
.talent-table td {
  padding: 12px 16px;
}
.label-cell {
  width: 20%;
  background-color: #f5f5f5; /* 浅灰色背景 */
  font-weight: 700;
  color: #6b6b6b;
  text-align: left;
  padding-right: 16px;
}
.value-cell {
  width: 30%;
  padding-left: 16px;
}
.value-cell1 {
  width: 70%;
  padding-left: 16px;
}
</style>
