$(document).ready(function () {
    $("#btn-desarrolladores").click(obtenerDesarrolladores);
    $("#btn-productos").click(obtenerProductos);
    $("#btn-guardar-producto").click(crearProducto);
    obtenerToken();
});

function obtenerToken() {
    var token = '';
    $.ajax({
        url: 'https://siigonube.siigo.com:50050/connect/token',
        type: 'Post',
        headers: {
            'Authorization' : 'Basic U2lpZ29XZWI6QUJBMDhCNkEtQjU2Qy00MEE1LTkwQ0YtN0MxRTU0ODkxQjYx',
            'Accept' : 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (result) {
            console.log(result);
            token = result.access_token;
            return token;
        },
        data: 'grant_type=password&username=Empresadeperas\admin@peras.com&password=siigo2019&scope=WebApi offline_access'
    });
}

function obtenerDesarrolladores() {
    var token = obtenerToken();
    $.ajax({
        url: 'http://siigoapi.azure-api.net/siigo/api/v1/Developers/GetAll?namespace=v1',
        type: "Get",
        headers: {
            "Authorization": token,
            "Ocp-Apim-Subscription-Key": "a21a8a8413134995b658925143dc87e7"
        }
    }).done(function (result) {
        $("#table-desarrolladores tbody tr").remove(); 
        $.each(result, function(item, value) {
            var tableRef = document.getElementById('table-desarrolladores').getElementsByTagName('tbody')[0];
            var newRow   = tableRef.insertRow(tableRef.rows.length);
            var newCell1  = newRow.insertCell(0);
            var newCell2  = newRow.insertCell(1);
            var newCell3  = newRow.insertCell(2);
            var newText  = document.createTextNode(value.FirstName);
            newCell1.appendChild(newText);
            newText  = document.createTextNode(value.LastName);
            newCell2.appendChild(newText);
            newText  = document.createTextNode((value.IsActive === 1) ? 'Activo' : 'No Activo');
            newCell3.appendChild(newText);
            console.log(value);
        });
    });
}

function obtenerProductos() {
    var token = obtenerToken();
    $.ajax({
        url: 'http://siigoapi.azure-api.net/siigo/api/v1/Products/GetAll?numberPage=0&namespace=v1',
        type: "Get",
        headers: {
            "Authorization": token,
            "Ocp-Apim-Subscription-Key": "a21a8a8413134995b658925143dc87e7"
        }
    }).done(function (result) {
        $("#table-productos tbody tr").remove();
        $.each(result, function(item, value) {
            var tableRef = document.getElementById('table-productos').getElementsByTagName('tbody')[0];
            var newRow   = tableRef.insertRow(tableRef.rows.length);
            var newCell0  = newRow.insertCell(0);
            var newCell1  = newRow.insertCell(1);
            var newCell2  = newRow.insertCell(2);
            var newCell3  = newRow.insertCell(3);
            var newCell4  = newRow.insertCell(4);

            var newText  = document.createTextNode(value.Id);
            newCell0.appendChild(newText);
            newText  = document.createTextNode(value.Code);
            newCell1.appendChild(newText);
            newText  = document.createTextNode(value.Description);
            newCell2.appendChild(newText);
            newText  = document.createTextNode(value.Cost);
            newCell3.appendChild(newText);

            var addRowBox = document.createElement("input");
            addRowBox.setAttribute("type", "button");
            addRowBox.setAttribute("value", "Eliminar");
            addRowBox.setAttribute("onclick", "borrarProducto(" + value.Id + ");");
            addRowBox.setAttribute("class", "btn btn-danger");
            newCell4.appendChild(addRowBox);
            console.log(value);
        });
    });
}

function borrarProducto(id) {
    var token = obtenerToken();
    console.log("Prodcuto a eliminar", id);
    $.ajax({
        url: 'http://siigoapi.azure-api.net/siigo/api/v1/Products/Delete/' + id + '?namespace=v1',
        type: 'DELETE',
        headers: {
            'Ocp-Apim-Subscription-Key': 'a21a8a8413134995b658925143dc87e7',
            'Authorization': token
        },
        success: function (result) {
            console.log(result);
            $('#exampleModal').modal('hide');
            obtenerProductos();
            $("#titulo-mensaje-salida").html("Eliminar Producto");
            $("#mensaje-salida").html('Producto Eliminado correctamente');
            $('#modal-out-put').modal('show');
        }
    });
}

function crearProducto() {
    var token = obtenerToken();
    var codigo = $("#text-codigo").val();
    var descripcion = $("#text-descripcion").val();
    var referencia = $("#text-referencia").val();
    var tipoProducto = $("#text-tipo-producto").val();
    var unidadMedida = $("#text-unidad-medida").val();
    var codigoBarras = $("#text-codigo-producto").val();
    var comentarios = $("#text-comentarios").val();
    var costo = $("#text-costo-producto").val();
    var estado = $("#text-estado-producto").val();
    var productoJSON = '{ "Code": "' + codigo + '", "Description": "' + descripcion + '", "ReferenceManufactures": "' + referencia + '", "ProductTypeKey": "' + tipoProducto + '",' +
        '"MeasureUnit": "' + unidadMedida + '", "CodeBars": "' + codigoBarras + '", "Comments": "' + comentarios + '", "TaxAddID": 0, "TaxDiscID": 0, "IsIncluded": true,' +
        '"Cost": ' + costo + ', "IsInventoryControl": true, "State": ' + estado + ', "PriceList1": 0, "PriceList2": 0, "PriceList3": 0, "PriceList4": 0,' +
        '"PriceList5": 0, "PriceList6": 0, "PriceList7": 0, "PriceList8": 0, "PriceList9": 0, "PriceList10": 0, "PriceList11": 0, "PriceList12": 0,' +
        '"Image": "string", "AccountGroupID": 40, "SubType": 0, "TaxAdd2ID": 0, "TaxImpoValue": 0}';
    console.log(productoJSON);
    $.ajax({
        url: 'http://siigoapi.azure-api.net/siigo/api/v1/Products/Create?namespace=v1',
        type: 'Post',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
            'Ocp-Apim-Subscription-Key': 'a21a8a8413134995b658925143dc87e7'
        },
        success: function (data) {
            console.log(data);
            $('#exampleModal').modal('hide');
            obtenerProductos();
            $("#titulo-mensaje-salida").html("Agregar Producto");
            $("#mensaje-salida").html('Producto guardado correctamente');
            $('#modal-out-put').modal('show');
        },
        //data: JSON.stringify(person)
        data: productoJSON
    });
}