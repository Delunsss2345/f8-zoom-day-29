const loadingFrame = document.getElementById('loading') ;

function sendHttpRequest(method = "GET" , url) {
    return new Promise((resolve , reject) => {
        const xhr = new XMLHttpRequest(); 
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                const type = xhr.getResponseHeader('Content-Type') ; 
                const isJson = type && type.includes("application/json") ; 
                isJson ? resolve(JSON.parse(xhr.responseText)) : resolve(xhr.responseText) ; 
            } 
        }

        xhr.open(method , url , true) ; 
        xhr.send() ; 
    })
}
const baseUrl = 'https://dummyjson.com' ; 

const sendProductDetail = async (e) => {
    const closestDiv = e.target.closest('[data-product-id]');
    const id = closestDiv.dataset.productId ; 
    window.location.href=`detail.html?id=${id}` ; 
}

const renderDetail = async (id) => {
    loadingFrame.hidden = false;
    const data = await sendHttpRequest("GET", `${baseUrl}/products/${id}`);
    const container = document.getElementById("product-detail");

    container.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "flex flex-col-reverse items-center sm:flex-row gap-8";

    // Image
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "flex justify-center items-start";
    const img = document.createElement("img");
    img.src = data.images[0];
    img.alt = data.title;
    img.className = "w-80 sm:w-120 h-auto object-cover";
    imageWrapper.appendChild(img);

    // Info
    const info = document.createElement("div");

    // Category
    const category = document.createElement("div");
    category.className = "flex gap-1 text-sm text-gray-500 mb-2";
    const home = document.createElement("a");
    home.className = "hover:underline";
    home.href = "./index.html";
    home.textContent = "HOME ";
    const categoryText = document.createElement("p");
    categoryText.textContent = `/ ${data.category.toUpperCase()}`;
    category.appendChild(home);
    category.appendChild(categoryText);

    // Title
    const title = document.createElement("h1");
    title.className = "text-xl sm:text-3xl font-bold mb-2 leading-snug";
    title.textContent = data.title;

    // Brand
    const brand = document.createElement("p");
    brand.className = "text-sm sm:text-lg italic text-gray-600 mb-4";
    const brandSpan = document.createElement("span");
    brandSpan.className = "ml-2 text-black font-semibold";
    brandSpan.textContent = data.brand;
    brand.textContent = "BRAND ";
    brand.appendChild(brandSpan);

    // Price
    const discountedPrice = data.price * (1 - data.discountPercentage / 100);
    const price = document.createElement("p");
    price.className = "text-xl font-semibold mb-4";

    price.innerHTML = `
        <span class="line-through text-gray-400 mr-2">$${data.price.toFixed(2)}</span>
        <span class="text-green-600">$${discountedPrice.toFixed(2)}</span>
        <span class="text-sm text-red-500 ml-2 italic">-${data.discountPercentage.toFixed(1)}%</span>
    `;

    // Rating
    const ratingBox = document.createElement("div");
    ratingBox.className = "flex items-center mb-6 gap-2";

    const starBackground = document.createElement('div') ; 
    starBackground.className = "relative text-gray-400"
    starBackground.textContent = "★★★★★"

    const widthRating = (data.rating / 5) * 100 ; 
    const ratingStart = document.createElement('div') ; 
    ratingStart.className = "absolute inset-0 overflow-hidden text-yellow-400"
    ratingStart.textContent = "★★★★★"
    ratingStart.style.width = `${widthRating}%` ; 
    starBackground.appendChild(ratingStart);

    const ratingText = document.createElement('p') ; 
    ratingText.textContent = `${data.rating} Stars` ; 
    ratingText.className = "text-sm font-semibold" ; 


    ratingBox.appendChild(starBackground);
    ratingBox.appendChild(ratingText);



    // Description
    const desc = document.createElement("p");
    desc.className = "text-base text-gray-700 leading-normal sm:leading-relaxed italic";
    desc.textContent = data.description;

    // Append all to info
    info.appendChild(category);
    info.appendChild(title);
    info.appendChild(brand);
    info.appendChild(price);
    info.appendChild(ratingBox);
    info.appendChild(desc);

    wrapper.appendChild(imageWrapper);
    wrapper.appendChild(info);
    container.appendChild(wrapper);

   loadingFrame.hidden = true ; 
};

const renderProducts = async () => {
    const data = await sendHttpRequest('GET', `${baseUrl}/products`);

    const productList = document.getElementById('products');
    const scroll = document.getElementById('scroll');
    console.log(scroll);
    scroll.style.overflow = 'hidden';

    loadingFrame.hidden = false;
    productList.innerHTML = "";

    data.products.forEach(product => {
        const discountedPrice = product.price * (1 - product.discountPercentage / 100);

        const productDiv = document.createElement("div");
        productDiv.setAttribute("data-product-id", product.id);
        productDiv.onclick = sendProductDetail;
        productDiv.className = "p-4 rounded border border-white mb-4 w-full max-w-sm cursor-pointer hover:-translate-y-2 transition-transform duration-300";

        productDiv.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" class="w-full object-cover rounded mb-2" />
            <h2 class="text-sm lg:text-lg line-clamp-1 lg:line-clamp-2 lg:h-13 font-semibold">${product.title}</h2>
            <p class="text-white mt-1">
                <span class="line-through text-gray-400 mr-1">$${product.price.toFixed(2)}</span>
                <span class="text-green-400 font-semibold">$${discountedPrice.toFixed(2)}</span>
                <span class="text-red-400 text-sm ml-2">-${product.discountPercentage.toFixed(1)}%</span>
            </p>
            <p class="text-sm text-gray-300 mt-1">⭐ ${product.rating} | Còn lại: ${product.stock}</p>
        `;

        productList.appendChild(productDiv);
    });

    loadingFrame.hidden = true;
    scroll.style.overflow = 'scroll';
};





if (window.location.pathname.endsWith("detail.html")) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
        renderDetail(id); 
    }
}
else {
    renderProducts();
}




