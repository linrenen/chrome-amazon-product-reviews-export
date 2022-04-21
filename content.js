var jq = document.createElement('script');
jq.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";
document.body.append(jq);

let box = document.createElement("div");
box.innerHTML = `
<div style="position: absolute;right: 0;top: 0;background: green;padding: 10px;z-index: 999">开始</div>
`;
let max_page = 2
let page = 1
let data = []

function exec_script() {
	data=[]
	page = 1
	extract_data()
}

function checkLoad() {
	setTimeout(() => {
		if ($('.reviews-content .cr-list-loading').hasClass('aok-hidden')) {
			setTimeout(() => {
				extract_data()
			}	, 700)
		} else {
			checkLoad()
			console.log('checkLoad')
		}
	}, 200)
}


function next() {
	page++
	$('.a-pagination .a-last a')[0].click()

	checkLoad()
}

function extract_data() {
	$('div[data-hook="review"]').each((i, e) => {
		let item = $(e)
		let date = item.find('[data-hook="review-date"]')[0].textContent.split("on ")[1]
		if (!date)date = item.find('[data-hook="review-date"]')[0].textContent.split(" ")[0]
		let rating = item.find('[data-hook="review-star-rating"]')[0].textContent.split(" ")[0]
		let name = item.find('.a-profile-name')[0].textContent
		let comment = item.find('[data-hook="review-body"]>span')[0].textContent.trim()
		data.push({date, rating, name, comment})
	})

	if (page >= max_page) {
		console.log('finish')
		exportCvs()
		return
	}

	next()
}

function exportCvs() {
	console.log(data)
	let str = `date,rating,name,comment\n`;
	for(let i = 0 ; i < data.length ; i++ ){
		for(let item in data[i]){
			str+=`${data[i][item] + '\t'},`;
		}
		str+='\n';
	}
	let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
	let link = document.createElement("a");
	link.href = uri;
	link.download =  "data.csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

box.onclick = exec_script
document.body.append(box);