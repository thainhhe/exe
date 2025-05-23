const Role = require("../../models/roles.model");
const systemconfig = require("../../config/system");
// [GET]: /api/admin/roles
module.exports.index = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({
      pageTitle: "Trang Nhóm quyền",
      recordsRole: roles,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error });
  }
};

// [POST]: /api/admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const record = new Role(req.body);
    await record.save();
    res.status(201).json({ message: "Role created successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Error creating role", error });
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const role = await Role.findOne({ deleted: false, _id: id });

    if (!role) {
      // If no role is found, send a 404 response or redirect
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({
      pageTitle: "Sửa Nhóm quyền",
      detailRole: role,
    });
  } catch (error) {
    // Log the error and handle other exceptions
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Role.updateOne({ _id: id }, req.body);

    res.status(200).json({ message: "Load ok" });
  } catch (error) {
    // Log the error and handle other exceptions
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    // Use findById to get a single document
    const role = await Role.findById(id); 
    console.log(role);

    if (!role) {
      // If no role is found, send a 404 response
      return res.status(404).json({ message: "Role not found" });
    } else {
      // Use await to wait for the update to complete
      await Role.updateOne(
        { _id: id },
        {
          deleted: !role.deleted, // Toggle the deleted status
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
    }

    // Send success response after update completes
    res.status(200).json({ message: "Load ok" });
  } catch (error) {
    // Log the error and handle exceptions
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const role = await Role.find(find);
  console.log(role);
  res.json({ recordsPermission: role });

  // res.send("Ok")
};

module.exports.permissionsPatch = async (req, res) => {
  console.log("req.body", req.body);

  try {
    for (const item of req.body) {
      console.log(item);
      const id = item.id;
      const permissionsChild = item.permissionsChild;
      console.log(permissionsChild);
      await Role.updateOne({ _id: id }, { permission: permissionsChild });
    }
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fail" });
  }
};
