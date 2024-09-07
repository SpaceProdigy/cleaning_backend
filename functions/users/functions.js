import { dinamicModel } from "../../models/cleaningSchedules.js";
import HttpError from "../../helpers/HttpError.js";

import Users from "../../models/usersModel.js";

export const allAdmins = async (adminsArr) => {
  const data = await Users.find({
    role: { $in: adminsArr },
  });
  return data;
};

export const isUser = async (id, email, displayName) => {
  const query = email ? { email } : { userId: id };

  const existingUser = await Users.findOne(query);

  if (existingUser) {
    return existingUser;
  } else {
    const data = Users.create({
      userId: id,
      email,
      role: "viewer",
      displayName,
    });
    return data;
  }
};

export const addOrUpdateAdmin = async ({ userId, email, role, remove }) => {
  if (remove) {
    const data = await Users.findByIdAndUpdate(
      userId,
      {
        role: ["viewer"],
      },
      {
        new: true,
      }
    );
    return data;
  }

  const query = userId ? { userId } : { email };

  const existingUser = await Users.findOne(query);

  if (existingUser) {
    const updatedRoles = existingUser.role.includes(role)
      ? existingUser.role
      : [...existingUser.role, role];

    const data = await Users.findOneAndUpdate(
      query,
      {
        role: updatedRoles,
      },
      {
        new: true,
        upsert: true,
      }
    );
    return data;
  } else {
    const data = await Users.findOneAndUpdate(
      query,
      {
        userId: userId ?? null,
        email: email ?? null,
        role: role ? [role] : ["viewer"],
      },
      {
        new: true,
        upsert: true,
      }
    );
    return data;
  }
};

export const updateUserById = async ({ id, email, user }) => {
  const searchCriteria = email ? { email } : { userId: id };

  const result = await Users.findOneAndUpdate(searchCriteria, user, {
    new: true,
    upsert: true, // Создать новый документ, если не найден
  });

  return result;
};
