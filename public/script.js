const studentForm = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll_no");
const courseInput = document.getElementById("course");
const emailInput = document.getElementById("email");

const tableBody = document.getElementById("studentTableBody");
const message = document.getElementById("message");

const submitButton = document.getElementById("submitButton");
const searchInput = document.getElementById("searchInput");

const formTitle = document.getElementById("formTitle");

let students = [];

let editStudentId = null;


// ========================================
// LOAD STUDENTS
// ========================================

async function loadStudents() {

    try {

        console.log("Loading students...");

        const response = await fetch("/api/students");


        if (!response.ok) {

            throw new Error(
                "Failed to fetch students"
            );

        }


        // Convert response into JavaScript

        students = await response.json();


        console.log(
            "Students received from server:",
            students
        );


        // Display students

        displayStudents(students);

    }

    catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Failed to load students
                </td>
            </tr>
        `;

    }

}


// ========================================
// DISPLAY STUDENTS
// ========================================

function displayStudents(studentList) {

    // Clear old table data

    tableBody.innerHTML = "";


    // If there are no students

    if (studentList.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No students found
                </td>
            </tr>
        `;

        return;

    }


    // Loop through students

    studentList.forEach((student) => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student.id}
            </td>

            <td>
                ${student.name}
            </td>

            <td>
                ${student.roll_no}
            </td>

            <td>
                ${student.course}
            </td>

            <td>
                ${student.email || "-"}
            </td>

            <td>

                <button
                    class="action-button edit-button"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>


                <button
                    class="action-button delete-button"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ========================================
// ADD / UPDATE STUDENT
// ========================================

studentForm.addEventListener(
    "submit",
    async function (event) {

        // Prevent page refresh

        event.preventDefault();


        // Get form values

        const name = nameInput.value.trim();

        const roll_no = rollInput.value.trim();

        const course = courseInput.value.trim();

        const email = emailInput.value.trim();


        // Basic validation

        if (!name || !roll_no || !course) {

            showMessage(
                "Please fill all required fields"
            );

            return;

        }


        // Create student object

        const studentData = {

            name: name,

            roll_no: roll_no,

            course: course,

            email: email

        };


        try {

            let response;


            // =================================
            // UPDATE
            // =================================

            if (editStudentId !== null) {

                console.log(
                    "Updating student:",
                    editStudentId
                );


                response = await fetch(
                    `/api/students/${editStudentId}`,
                    {

                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(studentData)

                    }
                );

            }


            // =================================
            // ADD
            // =================================

            else {

                console.log(
                    "Adding student:",
                    studentData
                );


                response = await fetch(
                    "/api/students",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(studentData)

                    }
                );

            }


            // Convert server response to JSON

            const data =
                await response.json();


            console.log(
                "Server response:",
                data
            );


            // =================================
            // CHECK FOR SERVER ERROR
            // =================================

            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Something went wrong"
                );

                return;

            }


            // =================================
            // SUCCESS
            // =================================

            showMessage(
                data.message
            );


            // Clear form

            resetForm();


            // Reload students

            await loadStudents();

        }

        catch (error) {

            console.error(
                "Add/Update error:",
                error
            );


            showMessage(
                "Server connection failed"
            );

        }

    }
);


// ========================================
// EDIT STUDENT
// ========================================

function editStudent(id) {

    console.log(
        "Editing student:",
        id
    );


    // Find student from our array

    const student = students.find(
        function (student) {

            return Number(student.id) === Number(id);

        }
    );


    // Student not found

    if (!student) {

        console.error(
            "Student not found:",
            id
        );

        return;

    }


    // Store ID

    editStudentId = id;


    // Put student data into form

    nameInput.value =
        student.name || "";


    rollInput.value =
        student.roll_no || "";


    courseInput.value =
        student.course || "";


    emailInput.value =
        student.email || "";


    // Change button

    submitButton.textContent =
        "Update Student";

    submitButton.style.color =
        "Blue";

    submitButton.style.backgroundColor =
        "grey";


    // Change heading

    if (formTitle) {

        formTitle.textContent =
            "Edit Student";

        formTitle.style.color =
            "Blue";

    }


    // Show cancel button

    const cancelButton =
        document.getElementById(
            "cancelButton"
        );


    if (cancelButton) {

        cancelButton.style.display =
            "block";

    }


    // Scroll to form

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ========================================
// DELETE STUDENT
// ========================================

async function deleteStudent(id) {

    console.log(
        "Deleting student:",
        id
    );


    // Ask for confirmation

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/students/${id}`,
                {

                    method: "DELETE"

                }
            );


        const data =
            await response.json();


        console.log(
            "Delete response:",
            data
        );


        if (!response.ok) {

            showMessage(
                data.message ||
                "Failed to delete student"
            );

            return;

        }


        // Success message

        showMessage(
            data.message
        );


        // Reload data

        await loadStudents();

    }

    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showMessage(
            "Server connection failed"
        );

    }

}


// ========================================
// SEARCH STUDENTS
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();


        // Filter students

        const filteredStudents =
            students.filter(
                function (student) {

                    return (

                        (student.name || "")
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        (student.roll_no || "")
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        (student.course || "")
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        (student.email || "")
                            .toLowerCase()
                            .includes(searchValue)

                    );

                }
            );


        // Display filtered students

        displayStudents(
            filteredStudents
        );

    }
);


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    // Clear all inputs

    studentForm.reset();


    // Stop edit mode

    editStudentId = null;


    // Change button back

    submitButton.textContent =
        "Add Student";

    submitButton.style.color =
        "";

    submitButton.style.backgroundColor =
        "";


    // Change heading back

    if (formTitle) {

        formTitle.textContent =
            "Add Student";

        formTitle.style.color =
            "";

    }


    // Hide cancel button

    const cancelButton =
        document.getElementById(
            "cancelButton"
        );


    if (cancelButton) {

        cancelButton.style.display =
            "none";

    }

}


// ========================================
// CANCEL EDIT
// ========================================

const cancelButton =
    document.getElementById(
        "cancelButton"
    );


if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        function () {

            resetForm();

        }
    );

}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(text) {

    message.textContent =
        text;


    // Remove message after 3 seconds

    setTimeout(
        function () {

            message.textContent =
                "";

        },
        3000
    );

}


// ========================================
// LOAD DATA WHEN PAGE OPENS
// ========================================

loadStudents();