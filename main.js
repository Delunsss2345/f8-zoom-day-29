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
    //Bọc ảnh và info
    const wrapper = document.createElement("div");
    wrapper.className = "grid grid-cols-1 md:grid-cols-2 gap-8";

    //Ảnh
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "flex justify-center items-start";

    const img = document.createElement("img");
    img.src = data.images;
    img.alt = data.title;
    img.className = "w-80 h-auto object-cover";

    imageWrapper.appendChild(img);

    //Info
    const info = document.createElement("div");

    const category = document.createElement("div");
    category.className = "flex gap-1 text-sm text-gray-500 mb-2";

    const home = document.createElement('a') ; 
    home.classList = "hover:underline"
    home.href = "./index.html" ; 
    home.textContent = "HOME "

    const categoryText = document.createElement('p') ; 
    categoryText.textContent = `/ ${data.category.toUpperCase()}`

    category.appendChild(home) ; 
    category.appendChild(categoryText) ; 
  


    const title = document.createElement("h1");
    title.className = "text-4xl font-bold mb-2 leading-snug";
    title.textContent = data.title;

    const brand = document.createElement("p");
    brand.className = "text-lg italic text-gray-600 mb-4";

    const brandSpan = document.createElement("span");
    brandSpan.className = "ml-2 text-black font-semibold";
    brandSpan.textContent = data.brand;

    brand.textContent = "BRAND ";
    brand.appendChild(brandSpan);

    //price
    const price = document.createElement("p");
    price.className = "text-2xl font-semibold mb-4";
    price.textContent = `$${data.price.toFixed(2)}`;


    //Lớp bọc rating
    const ratingBox = document.createElement("div");
    ratingBox.className = "flex items-center mb-6";

    //Start
    const stars = document.createElement("div");
    stars.className = "flex text-yellow-500 mr-2";

    const starCount = Math.floor(data.rating);

    const fullStars = document.createElement('span') //tạo sao trên data
    fullStars.textContent = "★".repeat(data.rating)

    const emptySpan = document.createElement("span");

    emptySpan.className = "text-gray-400";
    emptySpan.textContent = "★".repeat(5 - starCount); //lấy sao trừ 

    stars.appendChild(fullStars);
    stars.appendChild(emptySpan);

    const ratingText = document.createElement("p");
    ratingText.className = "text-sm text-gray-700";
    ratingText.textContent = `${data.rating.toFixed(2) || 0} RATING`;

    ratingBox.appendChild(stars);
    ratingBox.appendChild(ratingText);

    const desc = document.createElement("p");
    desc.className = "text-base text-gray-700 leading-relaxed";
    desc.textContent = data.description;

    info.appendChild(category);
    info.appendChild(title);
    info.appendChild(brand);
    info.appendChild(price);
    info.appendChild(ratingBox);
    info.appendChild(desc);

    wrapper.appendChild(imageWrapper);
    wrapper.appendChild(info);
    container.appendChild(wrapper);

    setTimeout(() => loadingFrame.hidden = true, 200)
};

const renderProducts = async () => {
    const data = await sendHttpRequest('GET', `${baseUrl}/products`);

    const productList = document.getElementById('products');
    const scroll = document.getElementById('scroll') ;
    console.log(scroll) ; 
    scroll.style.overflow = 'hidden';


    loadingFrame.hidden = false; 
    productList.innerHTML = "" ; 
    data.products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.setAttribute("data-product-id", product.id);
        productDiv.onclick = sendProductDetail
        productDiv.className = "p-4 rounded border border-white mb-4 w-full max-w-sm cursor-pointer hover:-translate-y-2 transition-transform duration-300"; 

        productDiv.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-auto object-cover rounded mb-2" />
            <h2 class="text-lg font-semibold h-12">${product.title}</h2>
            <p class="text-white-600 mt-2">$${product.price.toFixed(2)}</p>
        `;

        productList.appendChild(productDiv);
    });
    setTimeout(() => {
        loadingFrame.hidden = true , 
        scroll.style.overflow = 'scroll' 
    }  , 200)
};



(async () => {
  if (window.location.pathname.endsWith("detail.html")) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
    await renderDetail(id); 
    }
  } else {
    await renderProducts(); 
  }
})();







