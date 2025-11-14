export const rules = {
  requerido: (v) => !!v || "Este campo es requerido",
  numeroCuenta: (v) => /[0-9]+/.test(v) || "Ingresa un número de cuenta válido",
  numeroCuentaLongitud: (v) =>
    (v && v.length === 9) || "El número de cuenta debe contener 9 caracteres",
  rfcFormat: (v) =>
    /^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/.test(v) ||
    "Por favor, ingrese un RFC valido",
  correo: (v) => {
    const pattern =
      /(^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)|^$/;
    return (
      pattern.test(v) || "Por favor, ingrese un correo electrónico válido."
    );
  },
  numeroTelefono: (v) => {
    const pattern = /^[0-9]{10}$/;
    return pattern.test(v) || "Solo números con tamaño de 10 dígitos";
  },
  ext: v => (!v || v.length <= 5) || 'Ingresa 5 dígitos como máximo',
  number: v => /^([0-9])*$/.test(v) || 'Ingresa sólo números',
  maxLength: (len) => (v) =>
    (v || "").length <= len || `Longitud de texto no válida, máximo ${len} caracteres`,
};
