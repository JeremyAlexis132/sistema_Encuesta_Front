import router from "@/router";
import { baseFrontURLInterno } from "@/general";

export const currentDate = () => {
  let [day, month, year] = new Date().toLocaleDateString("es-MX").split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const logout = () => {
  // if(op == 'A') router.push("/admin");
  //else 
  router.push("/user");
  sessionStorage.clear();
};

export const parseDinero = (valor, decimal = true) => {
    return  decimal ? 
    `$${parseFloat(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
    `$${parseFloat(valor).toLocaleString('en-US')}` 
}

export const downloadBase64Data = (baseData, fileName) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = baseData;
  downloadLink.download = fileName;
  downloadLink.click();
};

export const creaUrl = (filename) => {
  let url = window.location.origin.includes('https') ? window.location.origin + '/' :
    window.location.origin + '/estancia_q/';
  return url + filename;
}

export const downloadFile = (fileName, archive_name) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = `${baseFrontURLInterno}${fileName}`;
  downloadLink.download = archive_name;
  downloadLink.click();
}

export const formatDateObject = date => {
  let [day, month, year] = date.toLocaleDateString("es-MX").split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

export function decifraToken(token) {
  // Decodifica el JWT
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  ); 

  const data = JSON.parse(jsonPayload);
  return data;
}

export function getFormatedDate(date) {
  if (!date) return "Sin fecha";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}