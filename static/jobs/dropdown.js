document.addEventListener("DOMContentLoaded", function () {
  var contentSelector = document.getElementById("contentSelector");

  function showSelectedContent() {
    var selectedValue = contentSelector.value;

    var contentSections = document.querySelectorAll(".content-section");
    contentSections.forEach(function (section) {
      section.classList.remove("show");
    });

    var selectedContent = document.getElementById(selectedValue);
    if (selectedContent) {
      selectedContent.classList.add("show");
      console.log("showing ", selectedContent);
    }
  }

  contentSelector.addEventListener("change", showSelectedContent);

  showSelectedContent();
});
