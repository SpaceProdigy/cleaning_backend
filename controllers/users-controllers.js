import {
  addOrUpdateAdmin,
  allAdmins,
  isUser,
  updateUserById,
} from "../functions/users/functions.js";
import { controllerWrapper } from "../decorators/index.js";

const getAdmins = async (req, res) => {
  const adminsArr = JSON.parse(req.headers.adminsarr || "[]");
  const data = await allAdmins(adminsArr);
  res.json(data);
};

const addAdmin = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const { email, remove } = req.headers;

  const data = await addOrUpdateAdmin({
    userId: id ?? "",
    email: email ?? "",
    role: role ?? "",
    remove: remove ?? false,
  });

  res.json(data);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const { email, displayName } = req.query;
  // console.log(email, displayName, id);
  const data = await isUser(id, email, displayName);
  res.json(data);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;

  const result = await updateUserById({
    id,
    user: req.body,
    email: email ?? null,
  });
  res.json(result);
};

export default {
  getUser: controllerWrapper(getUser),
  updateUser: controllerWrapper(updateUser),
  getAdmins: controllerWrapper(getAdmins),
  addAdmin: controllerWrapper(addAdmin),
};
