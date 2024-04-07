const express = require('express');
const router = express.Router();
const AdminUser = require('./user.js');

router.post("/approveUser/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { approved } = req.body;
        const user = await AdminUser.findById(userId);
        if (user.email === 'admin@masjid.com') {
            return res.status(400).send({ message: "Admin user cannot be disapproved" });
        }

        user.approved = !user.approved;
        const approvedUser = await user.save();      
        res.json(approvedUser);
    } catch (error) {
        console.error("Error approving user:", error);
        res.status(500).send({ message: "Something went wrong", error: error.message });
    }
}
);

module.exports = router;