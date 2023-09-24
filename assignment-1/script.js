"use strict";

const originTable = [
    {
        Name: "Refactoring",
        Author: "Martin Fowler",
        Topic: "Programming",
    },
    {
        Name: "Designing Data-Intensive Applications",
        Author: "Martin Kleppmann",
        Topic: "Database",
    },
    {
        Name: "The Phoenix Project",
        Author: "Gene Kim",
        Topic: "DevOps",
    },
];

let updatedTable;

getStorageTable();

// get popup Element
var popupElement1 = document.querySelector(".popup_1");
var popupElementDelete = document.querySelector(
    ".popup__delete__action--delete"
);
var popupElementCancel = document.querySelector(
    ".popup__delete__action--cancel"
);

var popupElement2 = document.querySelector(".popup_2");
var popupElementCreate = document.querySelector(".popup__add__action--create");

// get table from Local Storage
function getStorageTable() {
    //first render
    if (localStorage.getItem("table") === null) {
        localStorage.setItem("table", JSON.stringify(originTable));
        console.log("first render");

        updatedTable = originTable;
    } else {
        updatedTable = JSON.parse(localStorage.getItem("table"));
    }

    render(updatedTable);

    return updatedTable;
}

// set table to Local Storage
function setStorageTable(table) {
    localStorage.setItem("table", JSON.stringify(table));
    render(table);
}

// render table
function render(table) {
    let contentBody = "";
    let length = table.length;
    if (length) {
        for (var i = 0; i < length; i++) {
            contentBody += `
                <tr class="content__row">
                    <td class="content__row__Name">${table[i].Name}</td>
                    <td class="content__row__Author">${table[i].Author}</td>
                    <td class="content__row__Topic">${table[i].Topic}</td>
                    <td>
                        <button onclick="handleDelete(this)">
                            Delete
                        </button>
                    </td>
                </tr>`;
        }
    }
    document.querySelector(".content__body").innerHTML = contentBody;
}

function handleDelete(e) {
    let rowElement = e.parentElement.parentElement;

    let contentRowName = rowElement.querySelector(
        ".content__row__Name"
    ).innerText;
    let contentRowAuthor = rowElement.querySelector(
        ".content__row__Author"
    ).innerText;
    let contentRowTopic = rowElement.querySelector(
        ".content__row__Topic"
    ).innerText;

    popupElement1.querySelector(
        ".popup__delete__body #row-2"
    ).innerHTML = `<strong>${contentRowName}</strong> book?`;
    popupElement1.classList.remove("disabled");

    popupElementDelete.onclick = function () {
        // rowElement.remove();
        let table = getStorageTable();
        // console.log(table);
        for (var i = 0; i < table.length; i++) {
            if (
                (table[i].Name = contentRowName) &&
                (table[i].Author = contentRowAuthor) &&
                (table[i].Topic = contentRowTopic)
            ) {
                table.splice(i, 1);
                console.log(table);
                setStorageTable(table);
                break;
            }
        }

        popupElement1.classList.add("disabled");
    };

    popupElementCancel.onclick = function () {
        popupElement1.classList.add("disabled");
    };
}

function getData() {
    let inputsArray = Array.from(
        document.querySelectorAll(".popup__add__input__content")
    );

    let isValid = true;

    for (let i = 0; i < inputsArray.length; i++) {
        if (inputsArray[i].checkValidity() == false) {
            inputsArray[i].classList.add("invalid");
            isValid = false;
        } else {
            inputsArray[i].classList.remove("invalid");
        }
    }

    if (isValid) {
        let table = getStorageTable();
        table.push({
            Name: inputsArray[0].value,
            Author: inputsArray[1].value,
            Topic: inputsArray[2].value,
        });
        setStorageTable(table);
    }

    inputsArray.forEach(function (input) {
        input.value = "";
    });

    return isValid;
}

function handleCreate() {
    popupElement2.classList.remove("disabled");
    popupElementCreate.onclick = function () {
        if (getData()) {
            popupElement2.classList.add("disabled");
        }
    };
}

function handleSearch() {
    let contentRows = document.querySelectorAll(".content__row");
    let contentActionSearch = document.querySelector(
        ".content__action__search"
    );
    let filter = contentActionSearch.value.toUpperCase();

    // Loop through all table rows, and hide those who don't match the search query
    for (let i = 0; i < contentRows.length; i++) {
        let contentRowName = contentRows[i].querySelector(
            ".content__row__Name"
        );
        console.log(contentRowName);

        if (contentRowName) {
            let name = contentRowName.textContent || contentRowName.innerText;

            console.log(name.toUpperCase().indexOf(filter));
            if (name.toUpperCase().indexOf(filter) > -1) {
                contentRows[i].style.display = "";
            } else {
                contentRows[i].style.display = "none";
            }
        }
    }
}
