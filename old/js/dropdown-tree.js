var AllCategoriesData;
var tree_is_visible;

$(document).ready(function () {

  let tree = $('.js-dropdown-tree');

// generate tree from array of objects
  function generateTree(arr, listItem) {
    listItem.append('<ul></ul>');
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].children !== undefined && arr[i].children.length > 0) {
        listItem.children('ul').append('<li><div class="dropdown-tree__parent_item" data-catid="' + arr[i].id + '"><span class="dropdown-tree__item-line"></span>' + arr[i].name + '</div></li>');
        generateTree(arr[i].children, listItem.children('ul').children('li').eq(i));
      }
      else {
        listItem.children('ul').append('<li><div class="dropdown-tree__item" data-catid="' + arr[i].id + '"><span class="dropdown-tree__item-line"></span>' + arr[i].name + '</div></li>');
      }
    }
  }

// show on focus
  tree.siblings('input').click(function () {
    tree.fadeIn(300);
    $("#dropdown_edit").fadeIn(300);
    tree_is_visible = true;
  });

// hide on click out of box
  $(document).on('click touchstart', function (e) {
    if (!$(e.target).closest(tree.parent()).length) {
      if (tree_is_visible) {
        tree.fadeOut(300);
        $("#dropdown_edit").fadeOut(300);
        tree_is_visible =false;
      }
    }
  });

// check parent nodes
  function addClassToParentsNode(element, cls) {
    let list = element.parents('li').children('.dropdown-tree__item');
    list.each(function (index) {
      if (!list.eq(index).hasClass(cls)) {
        list.eq(index).addClass(cls);
      }
    });
  }

// recursively go to next parent item and clear check
  function removeClassFromParentNode(element, cls) {
    let list = element.closest('ul').parent('li').children('ul').find('.' + cls);
    if (!list.length && element.length) {
      element.closest('ul').parent('li').children('.dropdown-tree__item').removeClass(cls);
      removeClassFromParentNode(element.closest('ul').parent('li').children('.dropdown-tree__item'), cls);
    }
  }

  function getChildrenList(element) {
    return element.parent('li').find('ul');
  }

// check children
  function addClassToChildrens(element, cls) {
    let list = getChildrenList(element);
    if (list.length) {
      list.each(function (index) {
        if (!list.eq(index).children('li').children('.dropdown-tree__item').hasClass(cls)) {
          list.eq(index).children('li').children('.dropdown-tree__item').addClass(cls);
        }
      });
    }
  }

// remove check from children
  function removeClassFromChildrens(element, cls) {
    let list = getChildrenList(element);
    if (list.length) {
      list.each(function (index) {
        if (list.eq(index).children('li').children('.dropdown-tree__item').hasClass(cls)) {
          list.eq(index).children('li').children('.dropdown-tree__item').removeClass(cls);
        }
      });
    }
  }

// click on label, checkbox
  tree.on('click', '.dropdown-tree__item', function () {
    if (!$(this).hasClass('checked')) {
      addClassToParentsNode($(this), 'checked');
      addClassToChildrens($(this), 'checked');
    }
    else {
      $(this).removeClass('checked');
      removeClassFromChildrens($(this), 'checked');
      removeClassFromParentNode($(this), 'checked');
    }
  });

  $('.btn--cancel').click(function () {
    tree.fadeOut(300);
    $("#dropdown_edit").fadeOut(300);
    tree_is_visible = false;
  });

// apply button
  tree.find('.btn--apply').click(function () {
    let checkedList = tree.find('.checked'),
      result = [];

    checkedList.each(function (index) {
      result.push(checkedList.eq(index).data("catid"));
    });
    console.log(result);

    tree.siblings('input').val(result.join(','));
    tree.fadeOut(300);
    $("#dropdown_edit").fadeOut(300);
    tree_is_visible = false;
  });


  const sort_by = (field, reverse, primer) => {

    const key = primer ?
      function (x) {
        return primer(x[field])
      } :
      function (x) {
        return x[field]
      };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  }

  function list_to_tree(list) {
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentID !== "0") {
        // if you have dangling branches check that map[node.parentId] exists
        console.log(node.parentID);
        console.log(map[node.parentID]);
        list[map[node.parentID]].children.push(node);
      }
      else {
        roots.push(node);
      }
    }
    return roots;
  }


  $.ajax({
    type: "POST",
    url: "categories.json",
    dataType: "json",
    success: function (data, status) {
      console.log(data);

//      var AllCategoriesData = JSON.parse(ipcRenderer.sendSync('get-all-categories', ""));
      AllCategoriesData = data;

      if (Object.keys(AllCategoriesData).length > 0) {

        AllCategoriesData.sort(sort_by('fullpath', false, (a) => a.toUpperCase()));

        // console.log(data);
        // console.log( list_to_tree(data) );

        generateTree(list_to_tree(AllCategoriesData), tree.children('.dropdown-tree__content'));

        // slide children lists
        // append slide button to lists
        let listItems = tree.find('li');
        listItems.each(function (index) {
          if (listItems.eq(index).children('ul').length) {
            listItems.eq(index).append('<div class="dropdown-tree__btn"></div>');
          }
        });

        listItems.children('.dropdown-tree__btn:first').first().parent().addClass('children-show');

        listItems.children('.dropdown-tree__btn').click(function () {
          if ($(this).parent().hasClass('children-show')) {
            $(this).parent().removeClass('children-show');
          }
          else {
            $(this).parent().addClass('children-show');
          }
        });
      }
      else {
        alert("No data found. Please click on the \"Refresh Data\" button! ");
      }

    },
    error: function (data, status) {
      console.log("error Status: " + status);
    }

  });

});
