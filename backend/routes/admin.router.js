import express from "express";
import { authorizeRoles } from "../middleware/verifyRole.js";
import authenticateUser from "../middleware/verifyJWT.js";
import {createCity} from "../controller/admin.controler.js";
import { complaintCategories,getAllUsers, createEmployeeRecord , updateEmployeeRecord, deleteEmployeeRecord, getAdminAnalytics, generateReport, getFilterOptions,getEmployees ,updateEmployee,createEmployee,getZonesByCity,getCities ,getZones,toggleZoneStatus,uploadZonesFromGeoJSON,getEmployeesWithAccounts,updateUser,toggleEmployeeStatus,deleteUserAccount,assignCredentials,getAllCities,toggleCityStatus,getDonations,getContacts,exportContacts} from "../controller/admin.controler.js";
import { upload } from "../utils/zonesMulter.js";
let router = express.Router();

router.post("/create-city", authenticateUser, authorizeRoles("admin"), createCity);
router.post("/complaint-categories", authenticateUser, authorizeRoles("admin"), complaintCategories);
router.get("/get-all-users", authenticateUser,authorizeRoles("admin"),  getAllUsers);
router.post("/create-employee",authenticateUser,authorizeRoles("admin"), createEmployeeRecord);
router.put("/update-employee/:id",authenticateUser,authorizeRoles("admin"), updateEmployeeRecord);
router.delete("/delete-employee/:id", authenticateUser, authorizeRoles("admin"), deleteEmployeeRecord);
router.get("/analytics", authenticateUser, authorizeRoles("admin"), getAdminAnalytics);
router.get("/generate-report", authenticateUser, authorizeRoles("admin"), generateReport);
router.get("/filter-options", authenticateUser, authorizeRoles("admin"), getFilterOptions);
router.get("/employees",authenticateUser, authorizeRoles("admin", "cityManager"),getEmployees)
router.put("/employees/:id",authenticateUser, authorizeRoles("admin", "cityManager"),updateEmployee)
router.post("/employees",authenticateUser, authorizeRoles("admin"),createEmployee)
router.get("/cities",  authenticateUser, getCities);
router.get("/zones", authenticateUser,authorizeRoles("admin", "cityManager"), getZonesByCity);
router.get("/allzones", authenticateUser,authorizeRoles("admin"), getZones);
router.put("/zones/:id/toggle",authenticateUser,authorizeRoles("admin") , toggleZoneStatus);
router.post(
  "/zones/upload",
  authenticateUser,authorizeRoles("admin"),
  upload.single("file"),
  uploadZonesFromGeoJSON
);
router.get("/employees/accounts", authenticateUser, authorizeRoles("admin"), getEmployeesWithAccounts);
router.put("/users/:id", authenticateUser, authorizeRoles("admin"), updateUser);
router.put("/users/toggleActiveStatus/:id", authenticateUser, authorizeRoles("admin"), toggleEmployeeStatus);
router.delete("/del-users-acc/:id", authenticateUser, authorizeRoles("admin"), deleteUserAccount);
router.post("/users/assign", authenticateUser, authorizeRoles("admin"), assignCredentials);
router.get("/all-cities",  authenticateUser,authorizeRoles("admin"), getAllCities);
router.put("/cities/toggle/:id", authenticateUser, authorizeRoles("admin"), toggleCityStatus);
router.get("/donations", authenticateUser, authorizeRoles("admin"), getDonations);
router.get("/contact", authenticateUser, authorizeRoles("admin"), getContacts);
router.get("/contact/export", authenticateUser, authorizeRoles("admin"), exportContacts);

export default router;