Array.from(document.querySelectorAll('.fa-pencil')).forEach((element) => {
  element.addEventListener('click', function () {
    const oldFood = this.getAttribute('data-food');
    const description = this.getAttribute('data-description');
    const price = this.getAttribute('data-price');

    const newFood = prompt('Update food name:', oldFood);
    const newDescription = prompt('Update description:', description);
    const newPrice = prompt('Update price:', price);

    if (newFood && newDescription && newPrice) {
      fetch('/menuitems', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldFood: oldFood,
          newFood: newFood,
          description: newDescription,
          price: newPrice,
        }),
      })
        .then((response) => {
          if (response.ok) {
            window.location.reload();
          } else {
            console.error('Failed to edit');
          }
        })
        .catch((err) => console.error(err));
    }
  });
});


Array.from(document.querySelectorAll('.fa-trash-o')).forEach((element) => {
  element.addEventListener('click', function () {
    const food = this.getAttribute('data-food');

    // if (confirm(`Are you sure you want to delete "${food}"?`)) {
      fetch('/menuitems', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food: food }),
      })
        .then((response) => {
          if (response.ok) {
            window.location.reload();
          } else {
            console.error('Failed to delete');
          }
        })
        .catch((err) => console.error(err));
    }
   );
});
