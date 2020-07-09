export default {
  namespaced: true,
  state: {
    healthObject: {},
    userData: undefined,
    deleteId: undefined
  },
  mutations: {
    // 保存已填写的数据
    writeInFormData (st, val) {
      st.healthObject =
        Object.assign(st.healthObject, val);
    },
    keepUserData (st, val) {
      st.userData = val;
    },
    resetData (st, val) {
      st.healthObject = {};
    },
    setDeleteId (st, val) {
      st.deleteId = val;
    }
  }
};
