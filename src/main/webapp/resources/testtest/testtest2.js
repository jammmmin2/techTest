var repeatId = '1670805607664';
var repeatRow = 10;
var scrapOrTransferLen = $('[name=scrapOrTransfer]').length;


$(document).ready(function () {
	changeEventInsert('');
	$('<style media="print"> body {-webkit-print-color-adjust: exact;} </style>').appendTo('head');
	/* 폐차 말소 변화 시*/

	$(document).on('click', '[id^=button_docu]', function () {
		window.open('/ekp/service/file/fileView?fileUrl=C231568363/board/file/2022/08/18&fileName=400a6cfb-9046-4ae5-9fa0-c08f4c406814.zip&module=customDown&realFileName=개인정보 수집.이용 및 제3자 제공 동의서(대폐차).zip');
	});

	$('#repeat_insert_btn').on('click', function () {
		const index = $(`tr[data-repeat-group-id=${repeatId}]`).length / repeatRow - 1;
		let addId = index > 0 ? '_' + index : '';

		$(`tr [name=request_type${addId}]`).prop('checked', false);
		$(`tr input[name=scrapOrTransfer${addId}]`).prop('checked', false);
		setRequired(addId, false, false, false);

		changeEventInsert(addId);
	});
});

function setRequired(addId, value1, value2, value3 = false) {
	$(`[name=input_carname1${addId}],[name=date_start1${addId}],[name=input_person1${addId}]`).attr("required", value1);
	$(`[name=input_carname1${addId}],[name=date_start1${addId}],[name=input_person1${addId}]`).attr("disabled", !value1);
	/*
    if (value1) $(`[name=input_carname1${addId}],[name=date_start1${addId}],[name=input_person1${addId}]`).css('background', 'yellow');
    else $(`[name=input_carname1${addId}],[name=date_start1${addId}],[name=input_person1${addId}]`).css('background', 'white');
    */

	$(`[name=input_carname2${addId}],[name=date_start2${addId}],[name=input_person2${addId}],[name=agency${addId}]`).attr("required", value2);
	$(`[name=input_carname2${addId}],[name=date_start2${addId}],[name=input_person2${addId}],[name=agency${addId}]`).attr("disabled", !value2);
	/*
    if (value2) $(`[name=input_carname2${addId}],[name=date_start2${addId}],[name=input_person2${addId}],[name=agency${addId}]`).css('background', 'yellow');
    else $(`[name=input_carname2${addId}],[name=date_start2${addId}],[name=input_person2${addId}],[name=agency${addId}]`).css('background', 'white');
    */

	$(`[name=input_name${addId}],[name=input_jumin${addId}],[name=input_add${addId}]`).attr("required", value3);
	$(`[name=input_name${addId}],[name=input_jumin${addId}],[name=input_add${addId}]`).attr("disabled", !value3);
	/*
    if (value3) $(`[name=input_name${addId}],[name=input_jumin${addId}],[name=input_add${addId}]`).css('background', 'yellow');
    else $(`[name=input_name${addId}],[name=input_jumin${addId}],[name=input_add${addId}]`).css('background', 'white');
    */
}

function changeEventInsert(addId) {
	/* index 값 체크*/
	let cid = '';
	let isTransferChecked;

	$(`input[name=request_type${addId}],input[name=scrapOrTransfer${addId}]`).on('change', function () {
		let checkedValue = $(this).val();

		if (checkedValue === 'scrap') {
			checkedValue = cid;
			isTransferChecked = false;
			$(`#transfer${addId}`).prop("checked", false);
		} else if (checkedValue === 'transfer') {
			checkedValue = cid;
			isTransferChecked = true;
			$(`#scrap${addId}`).prop("checked", false);
		}

		/*
        request_type(상단 checkBox 4개)
        D : 동시대폐차 
        S : 선폐차
        B : 번호반납
        G : 기말소 대차
        
        scrapOrTransfer(하단 checkbox 2개)
        scrap : 폐차말소
        transfer : 이전말소
        */
		if (!$(`input[name=request_type${addId}]`).is(':checked')) {
			/* 폐차말소 또는 이전말소만 클릭 했을 경우 */
			setRequired(addId, false, false, false);
		} else {
			if (checkedValue === 'D') {
				cid = 'D';
				setRequired(addId, true, true, isTransferChecked);
				$(`#S${addId}`).prop("checked", false);
				$(`#B${addId}`).prop("checked", false);
				$(`#G${addId}`).prop("checked", false);
			}

			if (checkedValue === 'S' || checkedValue === 'B') {
				cid = 'S';
				setRequired(addId, true, false, isTransferChecked);
				$(`#D${addId}`).prop("checked", false);
				$(`#G${addId}`).prop("checked", false);
			}

			if (checkedValue === 'G') {
				cid = 'G';
				setRequired(addId, false, true, false);
				$(`input[name=scrapOrTransfer${addId}]`).attr('disabled', true);
				$(`input[name=scrapOrTransfer${addId}]`).attr('required', false);
				$(`#D${addId}`).prop("checked", false);
				$(`#S${addId}`).prop("checked", false);
				$(`#B${addId}`).prop("checked", false);
				$(`input[name=scrapOrTransfer${addId}]`).prop('checked', false);
			} else {
				$(`input[name=scrapOrTransfer${addId}]`).attr('disabled', false);
				// $(`input[name=scrapOrTransfer${addId}]`).attr('required', true);
			}
		}
	});

	$("#eapDocReg_formEditor [name=checkbox_cash" + addId + "]").on('change', function () {
		if ($(`input[name=request_type${addId}]:checked`).val() !== 'G' && $("input[name=checkbox_cash" + addId + "]").is(':checked')) {
			$(`[name=date_deposit${addId}]`).attr("required", true);
			/*
            $(`[name=date_deposit${addId}]`).css('background', 'yellow');
            */
		}
		else {
			$(`[name=date_deposit${addId}]`).attr("required", false);
			/*
            $(`[name=date_deposit${addId}]`).css('background', 'white');
            */
		}
	});
}

function beforeDraftFunc() {
	/*특정 값 비노출 처리*/
	$("input[name^=input_jumin").css("background-color", "black");
}

/*기안 버튼 클릭 시 validation*/
function validFormBeforeDraft() {
	var flag = true;

	let count = 0;
	$.each($(`input[name^=scrapOrTransfer]`), function (i, elm) {
		if ($(elm).attr('disabled') !== 'disabled') {
			if (i % scrapOrTransferLen === 0) { count = 0; }
			if (!$(elm).is(':checked')) {
				count++;
				if (count === scrapOrTransferLen) {
					alert('선택해주세요.');
					$(elm).focus();
					flag = false;
					return false;
				}
			}
		}
	});

	return flag;
}