export default {
  namespaced: true,
  state: {
    detailsData: undefined
  },
  mutations: {
    // 保存已填写的数据
    keepCostParam (st, val) {
      st.detailsData = val;
    }
  }
};
