import Panel from "../views/UsuarioPanelView.vue";

export default {
  component : ()=>import("@/modules/user/layouts/UserLayout.vue"),
  children: [
    {
      path: "/panel",
      name: "panel",
      component: () => Promise.resolve(Panel),
      // beforeEnter: (to, from, next) => {
      //   if (!sessionStorage.getItem("token")) next("/user");
      //   else next();
      // },
    },
  ]
}