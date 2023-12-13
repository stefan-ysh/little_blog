const saveOperationLog = async function (logData) {
  const res = await this.$http.post("/log", logData)
  if (res.status !== 200) {
    console.log("编辑操作记录保存失败")
  }
  console.log(res)
}
module.exports = saveOperationLog
