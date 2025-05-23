console.log("Đã vào file product.js bên admin");

const buttonChangeStatus = document.querySelectorAll("[ button-change-status]");
console.log("buttonChangeStatus", buttonChangeStatus);

const formChangeStatus = document.querySelector("#form-change-status");
console.log("formChangeStatus", formChangeStatus);
const path = formChangeStatus.getAttribute("data-path");
console.log("path:", path);

if (buttonChangeStatus.length > 0) {
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");

      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      console.log("statusCurrent", statusCurrent);
      console.log("id", id);
      console.log("statusChange", statusChange);

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      console.log("action:", action);
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
