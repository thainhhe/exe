console.log("Đã vào role.js admin");
// ----------------------------Permissions---------------------------
const tablePermissions = document.querySelector("[table-permissions]");
console.log(tablePermissions);

if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  console.log(buttonSubmit);
  buttonSubmit.addEventListener("click", () => {
    let permissions = [];
    const rows = document.querySelectorAll("[data-name]");
    // console.log(rows);
    rows.forEach((row) => {
      // console.log(row)
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      // console.log(name)
      // console.log(input)
      if (name == "id") {
        console.log(inputs);
        inputs.forEach((item) => {
          console.log();
          const id = item.value;
          permissions.push({
            id: id,
            permissionsChild: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            console.log(index + " " + name);
            permissions[index].permissionsChild.push(name);
          }
        });
      }
    });
    console.log(permissions);

    if (permissions.length > 0) {
      const formChangePermissions = document.getElementById(
        "form-change-permissions"
      );
      console.log(formChangePermissions);
      const inputPermissions = formChangePermissions.querySelector(
        "input[name='permissions']"
      );
      console.log(inputPermissions);
      inputPermissions.value = JSON.stringify(permissions);
      formChangePermissions.submit();
    }
  });
}
// -------------------------End Permissions------------------

// Lấy dữ liệu từ Permissions cập nhật ra giao diện




// End phần lấy dữ liệu từ Permissions cập nhật ra giao diện
