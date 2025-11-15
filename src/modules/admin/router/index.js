import Panel from "../views/AdminPanelView.vue";
import Usuarios from "../views/UsuariosView.vue";
import Encuestas from "../views/EncuestaView.vue";
import Respuestas from "../views/RespuestasView.vue";

export default {
  component : ()=>import("@/modules/admin/layouts/AdminLayout.vue"),
  children: [
    {
      path: "/panelAdmin",
      name: "panelAdmin",
      component: () => Promise.resolve(Panel),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem("token")) next("/admin");
        else next();
      },
    },
    {
      path: "/usuarios",
      name: "usuarios",
      component: () => Promise.resolve(Usuarios),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem("token")) next("/admin");
        else next();
      },
    },
    {
      path: "/encuestas",
      name: "encuestas",
      component: () => Promise.resolve(Encuestas),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem("token")) next("/admin");
        else next();
      },
    },
    {
      path: "/respuestas",
      name: "respuestas",
      component: () => Promise.resolve(Respuestas),
      beforeEnter: (to, from, next) => {
        if (!sessionStorage.getItem("token")) next("/admin");
        else next();
      },
    },
  ]
}