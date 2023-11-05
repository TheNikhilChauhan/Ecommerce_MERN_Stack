import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Data.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    cb(null, filename + "-" + uniqueSuffix + ".jpg");
  },
});

const upload = multer({ storage: storage });
export default upload;

//Multer needs to know where to store the uploaded files
// and how to name them. You can define a storage engine
// using multer.diskStorage or multer.memoryStorage,
// depending on the needs.
