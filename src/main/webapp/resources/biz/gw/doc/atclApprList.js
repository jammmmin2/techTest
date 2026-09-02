(function($, window) {
//----------------------------
/** AtclApprList 객체 */
//----------------------------
var AtclApprList = {
	name: 'AtclApprList',
	params : {},
	listBlockOpt : false,
	fromPN : null,
	listNos : null,
	heightTemp : "",
	viewListNos : [],
	pageNo : 1,
	list : [],
	init: function() {
		ObserverControl.addObserver(this);

		this.beforeBind();
		this.bind();
		this.afterBind();
		UI.init();
	},

	beforeBind: function() {
		ObserverControl.notifyObservers({type : 'SYNC_LIST_TYPE', data : 'B'});
		
		$('#docHeader_lockMsg').css('display','none');
		
		$('.mileage_box').hide();
		$('.title_guide_bar').hide();
		$('#atclList_totalSearch').hide();
		$('.srch_detail_lyr.total_srch_lyr.pull_right').hide();
		$('#atclList_addBookMark').show();
		$('#atclList_addPortlet').show();
		$('#atclList_interestTree').hide();
		$('#atclList_clearbox').hide();

		this.fn.renderToolbar();
		this.fn.lenderList();
		$('#docHeader_title').html(AtclApprList.param.title);
		if($('#atclApprList_layoutBtns').find('button:eq(0)').hasClass('active')){
			screenList();
		}
		
	},

	bind: function() {
		//검색기간 확인버튼
		$('.atclList_periodConfirm').off().on('click', function(){
			var chkType = $(this).closest('.period_slt').find('[name=periodType]:checked');
			var periodType = chkType.val();
			var chkName = doc_label_message4/*전체기간*/;
			
			var data = {periodType: periodType};

			if(periodType == 'Y') {
				//년간
				var $year = chkType.closest('li').find('select');
				var year = $year.val();

				data.searchStartDt = year + '-01-01 00:00:000';
				data.searchEndDt = year + '-12-31 23:59:999';
				chkName = $year.find(':selected').text();
			} else if(periodType == 'M') {
				//월간
				var $year = chkType.closest('li').find('select:eq(0)');
				var $month = chkType.closest('li').find('select:eq(1)');
				var year = $year.val();
				var month = $month.val();
				var date = new Date(year, month, 0).getDate();

				data.searchStartDt = year + '-' + month + '-' + '01' + ' 00:00:000';
				data.searchEndDt = year + '-' + month + '-' + date + ' 23:59:999';
				chkName = $year.find(':selected').text() + ' ' + $month.find(':selected').text();
			} else if(periodType == 'S') {
				//선택
				var $searchStartDt = chkType.closest('li').find('[name=searchStartDt]');
				if(!$searchStartDt.val()) {
					naon.ui.alert({
						message: doc_alert_message1/*검색 시작 일자를 입력하세요.*/,
						alertType: 'W',
						callback: function() {
							$searchStartDt.focus();
						}
					});
					return false;
				}
				var $searchEndDt = chkType.closest('li').find('[name=searchEndDt]');
				if(!$searchEndDt.val()) {
					naon.ui.alert({
						message: doc_alert_message2/*검색 종료 일자를 입력하세요.*/,
						alertType: 'W',
						callback: function() {
							$searchEndDt.focus();
						}
					});
					return false;
				}
				data.searchStartDt = $searchStartDt.val() + ' 00:00:000';
				data.searchEndDt = $searchEndDt.val() + ' 23:59:999';
				chkName = $searchStartDt.val() + '~' + $searchEndDt.val();
			} else {
				//전체
				data.searchStartDt = null;
				data.searchEndDt = null;
			}
//			$(this).closest('.drop_box').data('period', data);
//			chkType.closest('.combobox').find('.drop_value').text(chkName);
			$('.atclList_periodBox').data('period', data);
			$('.atclList_searchPeriodBtn').text(chkName);
			
		});
		
		//검색기간 취소버튼
		$('.atclList_periodCancel').off().on('click', function(){
			AtclApprList.fn.resetPeriodType();
		});
		
		//검색이벤트
		$('#atclList_searchWord').off()
		.on('keydown', this.fn.onSearchAtcl).next().off()
		.on('click', this.fn.onSearchAtcl);
		
		//검색 초기화버튼
		$('#atclList_resetBtn').off().on('click', this.fn.resetSearch);
		
		//전체 선택 체크박스
		$('#atclApprList_chkAll')
		.on('change', this.fn.onCheckAll);
		
		//제목, 크기, 등록자, 등록일, 조회, 추천, 첨푸파일 클릭시 정렬
		$("[id*='atclApprListSort']").click(function() {
			var orderType = $(this).attr('orderType');
			orderType = orderType || "D";

			$("[id*='atclApprListSort']").attr('orderMode','').attr('orderType','').attr('class','sort');

			if (orderType =='D'){
				$(this).attr('class','sort sort_up');
				$("[class*='sort']").attr('orderType','A');
			} else {
				$(this).attr('class','sort sort_dn');
				$("[class*='sort']").attr('orderType','D');
			}

			if($(this).attr('id') =='atclApprListSort_attach'){
				$("[class*='sort']").attr('orderMode','A');
			}else if($(this).attr('id') =='atclApprListSort_title'){
				$("[class*='sort']").attr('orderMode','T');
			}else if($(this).attr('id') =='atclApprListSort_fileSize'){
				$("[class*='sort']").attr('orderMode','Q');
			}else if($(this).attr('id') =='atclApprListSort_regUser'){
				$("[class*='sort']").attr('orderMode','W');
			}else if($(this).attr('id') =='atclApprListSort_regDate'){
				$("[class*='sort']").attr('orderMode','D');
			}else if($(this).attr('id') =='atclApprListSort_inq'){
				$("[class*='sort']").attr('orderMode','V');
			}else if($(this).attr('id') =='atclApprListSort_recomm'){
				$("[class*='sort']").attr('orderMode','R');
			}
			

			AtclApprList.fn.paramSet(AtclApprList.pageNo);
			$.extend(AtclApprList.params, {orderby : $("[class*='sort']").attr('orderMode'), ascDesc : $("[class*='sort']").attr('orderType')});
			AtclApprList.fn.lenderList(AtclApprList.params);
		});
		
		//게시물 선택
		$('#list_resizable').off()
		.on('click', '._atcl', this.fn.onSelectAtcl)
		.on('click', '._popup', this.fn.onSelectAtclPopup)
		.on('click', '._brdPath', this.fn.getDocPath)
		.on('click', '._userInfo', this.fn.onUserInfo)
		.on('click', '.lst_chk:checkbox', this.fn.onCheckDoc)
		.on('click', '._viewerLst', this.fn.onViewerList)
		.on('click', '._recommendLst', this.fn.onRecommendList);
		
		
		//레이아웃관련
		$('#atclApprList_layoutBtns')
		.off()
		.on('click', '._cbnBtn', this.fn.onScreenList)
		.on('click', '._vtcBtn', this.fn.onScreenVertical)
		.on('click', '._hrzBtn', this.fn.onScreenHorizontal)
		.on('click', '._rspBtn', this.fn.onScreenResponsive);
		
		//인쇄
		$('#atclApprList_print').off().on('click', this.fn.onPrint);
		
		//즐겨찾기 추가
		$('#atclList_addBookMark').off().on('click', this.fn.onAddBookMark);
		
		//포틀릿 추가
		$('#atclList_addPortlet').off().on('click', this.fn.onAddPortlet);
		
		//툴바
		$('#atclApprList_toolbar').off()
		.on('click', '._approveBtn', this.fn.onApproval) //승인
		.on('click', '._rejectBtn', this.fn.onRejectDialog) //반려의견
		.on('click', '._mailSend', this.fn.onSendMail) //메일 발송
		.on('click', '._atclReg', this.fn.onRegBrdAtcl) //게시 등록
		.on('click', '._noteSend', this.fn.onSendNote) //쪽지 발송
		.on('click', '._pcsave', this.fn.onPcSave) //PC저장
		.on('click', '._chkAll', this.fn.onCheckAll);

		//반려
		$('#atclApprList_rejectConfirm').off().on('click', this.fn.onReject);
	},

	afterBind: function() {
		
		$(window).resize(function(){
			if(window.AtclApprList){
				AtclApprList.fn.divisionRefresh();
			}
		});
		
		
		$(".input_date").datepicker({
			changeMonth: true,
			changeYear: true,
			yearSuffix: '&nbsp;'
		});
		
	},

	//----------------------------
	/** 처리 메서드가 정의된 객체 */
	//----------------------------
	fn : {
		/**
		 * ObserverControl의 구현 메서드
		 * 
		 * @override
		 * @param param
		 */
		update: function(param) {
			switch (param.type) {
			case 'PREV_NEXT_ATCL' :
				if($.inArray(param.data.atclNo, AtclApprList.viewListNos) == -1){
					if(param.data.fromPN == 'N'){
						AtclApprList.fn.goPage((AtclApprList.pageNo+1), param.data.fromPN);
					}else{
						AtclApprList.fn.goPage((AtclApprList.pageNo-1), param.data.fromPN);
					}
				}else{
					AtclApprList.fn.listSelected(param.data);
				}
				
				
			break;
			case 'APPR_RELOAD_LIST' :
				AtclApprList.fn.paramSet();
				AtclApprList.fn.lenderList(AtclApprList.params);
				break;
			case 'INIT_LIST_DOC_LOC' : 
				ObserverControl.notifyObservers({type: 'OFF_BEFORE_UNLOAD'});
				AtclApprList.fn.getDocPath(param.data.brdId);
				break;
			case 'APPR_REJECT' :
				$("input[name='chkUserList']").each(function(i){
					$(this).prop('checked', false);
				});
				if($('.lst_hr').css('display') != 'none'){
					$("#list_resizable").find('tr').each(function(){
						if($(this).hasClass('selected')){
							$(this).find('input:checkbox').prop('checked', true);
							return false;
						}
					});
				}else{
					$("#list_resizable").find('li').each(function(){
						if($(this).hasClass('selected')){
							$(this).find('input:checkbox').prop('checked', true);
							return false;
						}
					});
				}
				
				AtclApprList.fn.onRejectDialog();
				break;
			case 'INIT_APPR_LIST' :
				ObserverControl.notifyObservers({type: 'OFF_BEFORE_UNLOAD'});
				$('#docMain_contents').show();
				$('#docMain_config').hide();
				$('#docMain_write').hide();
				$('#division_main').show();
				$('#docHeader_title').text(doc_label_message54/*문서등록승인*/);
				if(param.data && param.data.atclNo){
					AtclApprList.param.atclNo = param.data.atclNo;
				}
				AtclApprList.fn.resetSearch();

				DocMain.fn.toggleDocHeaderBtn();
				break;
			case 'DIVISION_REFRESH':
				AtclApprList.fn.divisionRefresh();
				break;				
				default: // do nothing
			}
		},
		/**
		 * 리스트 그리기
		 * */
		lenderList : function(param, fromPN){
			var data = {'brdId' : AtclApprList.param.brdId};
			
			if(param){
				$.extend(data, param);
			}
			
			if(AtclApprList.param.wksId) data['wksId'] = AtclApprList.param.wksId;
			
			var options = {
					url : '/service/doc/article/listAtclJson',
					data : data,
					sendDataType : 'string',
					dataType : 'json',
					useWrappedObject : true,
					type : 'post',
					success : function(res, statusText) {
						//반출문서 조회 게시판일 경우 목록 설정 폴더형 버튼 안보이기
						if(AtclApprList.param.brdId == 'DBO'){
							$("#atclList_listGrid button").last().hide();
							if($("#atclList_listGrid button").last().hasClass("active")){
								$("#atclList_listGrid button").removeClass("active").eq(0).addClass("active");
								
								DocMain.fn.SaveViewSetting();
							}
						}else{
							$("#atclList_listGrid button").last().show();
						}
						
						$.merge(res.data.noticeList, res.data.list);
						res.data.list = res.data.noticeList;
						if(!res.data.list || res.data.list.length == 0){
							var observerData = {
									type : 'NOT_CONTENTS',
							};
							ObserverControl.notifyObservers(observerData);
						}
						AtclApprList.listNos = res.data.listNos;
						AtclApprList.list = res.data.list;
						AtclApprList.viewListNos = [];
						
						//게시판 구분
						$.each(res.data.list, function(i, atcl) {
							if(AtclApprList.param.brdId == 'DBW'){
								atcl.brdNnoti = '<a href="#" class="dir _brdPath" data-brd-id="'+atcl.brdId+'">['+atcl.brdName+']</a>';
							}
						});

						for(var i=0; i<res.data.list.length; i++){
							AtclApprList.viewListNos.push(res.data.list[i].atclNo);
							//첨부파일 아이콘 설정
							if(res.data.list[i].attCnt > 1){
								res.data.list[i].fileExtClass = 'idtp idtp_cplx';
								res.data.list[i].fileExtNm = doc_label_message2/*복합문서*/;
							}else if(res.data.list[i].attCnt == 1){
								if(res.data.list[i].noticeYn == 'Y'){
									res.data.list[i].fileExtClass = 'fico';
								}else{
									if(res.data.list[i].fileExt){
										res.data.list[i].fileExtNm = res.data.list[i].fileExt.toUpperCase();
										res.data.list[i].fileExtClass = 'fico fico_' + res.data.list[i].fileExt;
									}
								}
								
							}
							
							//등록자 사진 설정
							if(res.data.list[i].thumbUrl) {
								res.data.list[i].thumbFullUrl = frameworkProperties.context + res.data.list[i].thumbFullUrl; 
							}else{
								res.data.list[i].thumbFullUrl = frameworkProperties.image_server+"/resources/common/img/@tmp_man.jpg";
							}
							
						}
						$('#atclApprList_list').html(Mustache.render($('#atclApprList_listTemp').html(), res.data.list));
						$('#atclApprList_list2').html(Mustache.render($('#atclApprList_listTemp2').html(), res.data.list));
						
						//페이징 설정
						if(res.data.list.length > 0){
							AtclApprList.fn.renderPaging(res.data.paging);
						}else{
							$("#atclApprList_paging").html('');
						}
						
						if(fromPN){
							if(fromPN == 'N'){
								if($('.lst_hr').css('display') != 'none'){
									$("#list_resizable").find('tr:eq(0)').addClass('selected')
									.find('._atcl').last().focus().click();
								}else{
									$("#list_resizable")
									.find('li:eq(0)').addClass('selected')
									.find('._atcl:eq(0)').focus().click();
								}
							}else{
								
								if($('.lst_hr').css('display') != 'none'){
									$("#list_resizable").find('tr').last().addClass('selected')
									.find('._atcl').last().focus().click();
								}else{
									$("#list_resizable")
									.find('li').last().addClass('selected')
									.find('._atcl').last().focus().click();
								}
								
							}
						}else{
							if(AtclApprList.param.atclNo){
								$.each($("#list_resizable").find('li'), function(i){
									if($(this).find('._atcl').data('atclNo') == AtclApprList.param.atclNo){
										$(this).find('._atcl').addClass('selected').click();
										$("#list_resizable").find('tr:eq('+i+')').addClass('selected');
										delete AtclApprList.param.atclNo;
									}
									
								});
							}
							//첫번째글 자동선택
//							if(!$('#atclList_layoutBtns').find('button:eq(0)').hasClass('active')){
//								$("#list_resizable")
//								.find('li:eq(0)').addClass('selected')
//								.find('._atcl:eq(0)').click();
//								$("#list_resizable").find('tr:eq(0)').addClass('selected');
//							};
						}
						
						AtclApprList.fn.divisionRefresh();
						
						ObserverControl.notifyObservers({
							type: 'LIST_LOAD'
						});
					}
				};
				naon.http.ajax(options);
		},
		/**
		 * 페이징을 출력한다.
		 */
		renderPaging: function(paging) {
			var pageSettings = {
				pageNo: paging.pageNo,
				listBlock: paging.listBlock,
				pageBlock: paging.pageBlock,
				totalCount: paging.totalCount,
				funcName: "AtclApprList.fn.goPage" // 페이지 클릭하면 호출할 함수 
			};

			var pagenavi = naon.paging.getNavigator(pageSettings);
			$("#atclApprList_paging").html(pagenavi);
		},
		renderToolbar: function() {
			var data = {};

			if(AtclApprList.param.brdId == 'DBP') {
				data.isApprove = true;
				data.isReject = true;
			}
			$('#atclApprList_toolbar').html(Mustache.render($('#atclApprList_toolbarTemplate').html(), data))
		},
		goPage: function(pageNo, fromPN) {
			AtclApprList.pageNo = pageNo;
			AtclApprList.fn.paramSet(pageNo);
			AtclApprList.fn.lenderList(AtclApprList.params, fromPN);
		},
		paramSet: function(pageNo){
			var searchWord 				= $("#atclList_searchWord").val();
			var searchField				= $("input:radio[name=searchField]:checked").val();
			var listBlock				= $("input:radio[name=listBlock]:checked").val();
			var readType				= $("input:radio[name=readType]:checked").val();
			var periodType				= $("input:radio[name=periodType]:checked").val();
			var listType				= $("input:radio[name=listType]:checked").val();
			var startDate = '';
			var endDate = '';
			if($('.atclList_periodBox:eq(0)').data('period')){
				startDate = $('.atclList_periodBox:eq(0)').data('period').searchStartDt;
				endDate = $('.atclList_periodBox:eq(0)').data('period').searchEndDt;
			}
			
			if(!pageNo){
				pageNo = 1;
			}
			
			if(periodType == '') periodType = 'all';
			else periodType = 'custom';
				
			if(AtclApprList.params){
				$.extend(AtclApprList.params, {
					"searchWord":searchWord,
					"periodType":periodType,
					"searchField":searchField,
					"paging.listBlock":listBlock,
					"searchStartDate":startDate,
					"searchEndDate":endDate,
					"paging.pageNo":pageNo,
					"readType":readType,
					"listType":listType
				});
			}else{
				AtclApprList.params = {
					"searchWord":searchWord,
					"periodType":periodType,
					"searchField":searchField,
					"paging.listBlock":listBlock,
					"searchStartDate":startDate,
					"searchEndDate":endDate,
					"paging.pageNo":pageNo,
					"readType":readType,
					"listType":listType
						
				};
			}
			
		},
		/**
		 * 게시물 검색 이벤트 처리
		 */
		onSearchAtcl: function(e) {
			if(!e.keyCode || e.keyCode === 13){
				AtclApprList.fn.paramSet();
				AtclApprList.fn.lenderList(AtclApprList.params);
			}
		},
		/**
		 * 검색 초기화
		 * */
		resetSearch: function() {
			$('#atclList_searchWord').val('');
			AtclApprList.fn.assignPeriodData(null);
			AtclApprList.fn.resetPeriodType();
			AtclApprList.fn.resetOption();
			AtclApprList.fn.lenderList({brdId : AtclApprList.param.brdId || 'DBP'});
		},
		assignPeriodData: function(data) {
			var formula = null;
			var chkName = doc_label_message4/*전체기간*/;
			if (data && data.srchSetup) {
				formula = $.parseJSON(data.srchSetup);
				if (formula.periodType == 'Y') {
					var year = formula.searchStartDt.substring(0, 4);
					chkName = year + doc_label_message5 /*년*/;
				} else if(formula.periodType == 'M') {
					var year = formula.searchStartDt.substring(0, 4);
					var month = formula.searchStartDt.substring(5, 7);
					chkName = year + doc_label_message5 /*년*/ + ' ' + month + doc_label_message6 /*월*/;
				} else if(formula.periodType == 'S') {
					chkName = formula.searchStartDt.substring(0,10) + '~' + formula.searchEndDt.substring(0,10);
				}
				formula = {periodType: formula.periodType, searchStartDt: formula.searchStartDt, searchEndDt: formula.searchEndDt};
			}
			$('.atclList_searchPeriodBtn').text(chkName);
			$('.atclList_periodBox').data('period', formula);
		},
		/**
		 * 기간검색 초기화
		 * */
		resetPeriodType: function() {
			var data = $('.atclList_periodBox').data('period');
			var chkType = $('.atclList_periodBox').find('input[value="' + (data ? data.periodType : '') + '"]');
			chkType.click();

			if (data) {
				if (data.periodType == 'Y') {
					var year = data.searchStartDt.substring(0, 4);
					var $year = chkType.closest('li').find('select');
					$year.find('[value='+year+']').prop('selected', true);
				} else if(data.periodType == 'M') {
					var year = data.searchStartDt.substring(0, 4);
					var month = data.searchStartDt.substring(5, 7);
					var $year = chkType.closest('li').find('select:eq(0)');
					var $month = chkType.closest('li').find('select:eq(1)');
					$year.find('[value='+year+']').prop('selected', true);
					$month.find('[value='+month+']').prop('selected', true);
				} else if(data.periodType == 'S') {
					var $searchStartDt = chkType.closest('li').find('[name=searchStartDt]');
					var $searchEndDt = chkType.closest('li').find('[name=searchEndDt]');
					$searchStartDt.val(data.searchStartDt.substring(0,10));
					$searchEndDt.val(data.searchEndDt.substring(0,10));
				}
			}
		},
		/**
		 * 검색타입 초기화
		 * */
		resetOption: function() {
			$('#atclList_srch_1').prop('checked', true);
			UI.init();
		},
		/**
		 * 게시물선택 이벤트시.
		 */
		onSelectAtcl : function(){
			var idx = 0;
			var listNos = [];
			
			if($(this).closest('li').length > 0){
				$($("#list_resizable").find('ul').find('input[name=\'chkUserList\']')).each(function(){
					listNos.push($(this).val());
				});
				idx = $(this).closest('li').index();
			}else{
				$($("#list_resizable").find('tbody').find('input[name=\'chkUserList\']')).each(function(){
					listNos.push($(this).val());
				});
				idx = $(this).closest('tr').index();
			}
			
			$("#list_resizable").find('ul').children('li').removeClass('selected').find(':checkbox').prop('checked', false);
			$("#list_resizable").find('tbody').children('tr').removeClass('selected').find(':checkbox').prop('checked', false);
			$("#list_resizable").find('li:eq('+idx+')').addClass('selected').find(':checkbox').prop('checked', true);
			$("#list_resizable").find('tr:eq('+idx+')').addClass('selected').find(':checkbox').prop('checked', true);
			var data = {'atclNo' : $(this).data('atclNo'), 'listNos':AtclApprList.listNos, 'pageNo':AtclApprList.pageNo, 'brdId':AtclApprList.param.brdId, 'grpId':AtclApprList.param.grpId, 'hisSeq':$(this).data('hisSeq')};
			if(AtclApprList.fromPN) $.extend(data, {fromPN : AtclApprList.fromPN});	
			var options = {
					url : '/inc/doc/article/viewAtcl',
					data : data,
					sendDataType : 'string',
					dataType : 'html',
					useWrappedObject : true,
					type : 'post',
					success : function(htmlRes, statusText) {
						AtclApprList.fromPN = null;
						naon.doc.writeHtml(htmlRes, 'cont_view_type');
						
						if ($('#layout_container').hasClass('scr_list')) {
							screenView();
						}
					}
				};
				naon.http.ajax(options);
		},
		/**
		 * 게시물선택 새창으로 보기 이벤트시.
		 */
		onSelectAtclPopup : function(){
			var listBlock = $("input:radio[name=listBlock]:checked").val();
			var data = {'atclNo' : $(this).data('atclNo'), 'listNos':AtclApprList.listNos, 'pageNo':AtclApprList.pageNo, 'listBlock':listBlock, 'brdId':AtclApprList.param.brdId, 'grpId':AtclApprList.param.grpId, 'hisSeq':$(this).data('hisSeq')};
			if(AtclApprList.fromPN) $.extend(data, {fromPN : AtclApprList.fromPN});
			
			naon.openUi.callPopup(data, 'atclViewPopup', '/view/doc/article/viewAtclPopup', 1000, 700, 1, 1, 0, 0, 1);
		},
		/**
		 * 목록만 보기
		 * */
		onScreenList: function(){
			screenList();
			AtclApprList.fn.onLayoutChange(1, true);
		},
		/**
		 * 세로분할
		 * */
		onScreenVertical: function() {
			screenVertical();
			AtclApprList.fn.onLayoutChange(2, true);
		},
		/**
		 * 가로분할
		 * */
		onScreenHorizontal: function() {
			screenHorizontal();
			AtclApprList.fn.onLayoutChange(3, true);
		},
		/**
		 * 반응형 레이아웃
		 * */
		onScreenResponsive: function() {
			layoutControlAuto();
			AtclApprList.fn.onLayoutChange(4, true);
		},
		/**
		 * 레이아웃 변경
		 * */
		onLayoutChange: function(i, cookieYn) {
			if(cookieYn){
				naon.http.setCookie('docLayoutMode',i);
			}
			
			ObserverControl.notifyObservers({
				type : "DIVISION_REFRESH"
			});			
		},
		/**
		 * 게시물 선택
		 * */
		listSelected : function(data){
			if(data.fromPN) AtclApprList.fromPN = data.fromPN;
			if($('.lst_hr').css('display') != 'none'){
				$.each($("#list_resizable").find('tr').find('._atcl'), function(){
					if($(this).data('atclNo') == data.atclNo){
						$(this).closest('tr').addClass('selected');
						$(this).focus().click();
					}
				});
				
			}else{
				$.each($("#list_resizable").find('ul').find('._atcl'), function(){
					if($(this).data('atclNo') == data.atclNo){
						$(this).closest('ul').addClass('selected');
						$(this).focus().click();
					}
				});
			}
			
		},
		/**
		 * 인쇄
		 */
		onPrint: function() {
			var checkedList = $("input[name='chkUserList']:checked");

			if(checkedList.length == 0) {
				naon.ui.alert({
					message: doc_alert_message3/*문서를 먼저 선택하세요*/,
					alertType: 'W',
					callback: function() {}
				});
				return;
			}
			var atclNoArr = []; 
			$("input[name='chkUserList']:checked").each(function(i){
				if($.inArray($(this).val(), atclNoArr) == -1){
					atclNoArr.push($(this).val());
				}
			});
			
			var data = {'atclNoArr' : atclNoArr.join(',')};
			naon.openUi.callPopup(data, 'printWin', '/print/doc/article/docPrint', 815, 500, 1);
		},
		/**
		 * 즐겨찾기 추가
		 * */
		onAddBookMark : function(){
			var url = frameworkProperties.context+'/scr/doc/board/docMain?docTabSel='+AtclApprList.param.docTabSel+'&folderLoc='+AtclApprList.param.folderLoc;
			var param = {
				bookmarkTitle: AtclApprList.param.title,
				bookmarkUrl : url,
				bookmarkTarget :'subBody',
				linkSystemId : '1001' 
			};
			naon.openUi.loadMbkDialog(param);
		},
		
		/**
		 * 포틀릿 추가
		 * */
		onAddPortlet : function(){
			var data = {
				'portletName' : AtclApprList.param.title, 
				'rssUrl':frameworkProperties.context+'/service/openapi/rss/getDocList?brdId='+AtclApprList.param.brdId
					+ '&docTabSel=' + AtclApprList.param.docTabSel
					+ '&folderLoc=' + AtclApprList.param.folderLoc,
				'linkSystemId':'1001',
				'wndType' : 'N'
			};
			naon.openUi.callPopup(data, 'addPortlet', '/view/myPortlet/ptlMyPortletRegPopup', 500, 440, 1);
		},
		
		/**
		 * 문서함 경로를 반환한다.
		 * */
		getDocPath : function(brdId){
			var strBrdId = typeof(brdId) != 'string' ?  $(this).data('brdId') : brdId;
			var options = {
					url : '/service/doc/board/getDocPath',
					data : {'brdId':strBrdId},
					sendDataType : 'string',
					dataType : 'json',
					useWrappedObject : true,
					type : 'post',
					success : function(res, statusText) {
						var observerData = {
								type : 'SELECT_DOC_TREE',
								data : {
									folderLoc : res.data
								}
						};
						ObserverControl.notifyObservers(observerData);
						
					}
				};
				naon.http.ajax(options);
		},
		/** 선택된 글리스트. */
		selectedAtclList: function() {
			var listBox = null;
			var data = {
				atclNoArr: [],
				hisSeqArr: []
			};
			
			if($('#listbox').hasClass('listbox_vr') && !$('#layout_container').hasClass('scr_list')) {
				listBox = $('#atclApprList_list2');
			} else {
				listBox = $('#atclApprList_list');
			}
			listBox.find("input[name='chkUserList']:checked").each(function(){
				var chk = $(this);
				data.atclNoArr.push(chk.val());
				data.hisSeqArr.push('' + chk.data('hisSeq'));
			});
			return data;
		},
		onCheckAll: function() {
			var checked = this.checked;
			$('#atclApprList_chkAll,#atclApprList_vrChkAll').prop('checked', checked);
			$("#list_resizable").find("input[name='chkUserList']:not(:disabled)").prop("checked", checked);
			if (this.checked) {
				$("input[name='chkUserList']").parents('tr,li').addClass('selected');
			} else {
				$("input[name='chkUserList']").parents('tr,li').removeClass('selected');
			}
			AtclApprList.fn.setToolbar();
		},
		onCheckDoc: function() {
			var chkbox = $(this);
			var idx = 0;
			var isVr = $('#listbox').hasClass('listbox_vr') && !$('#layout_container').hasClass('scr_list');
			var idx = chkbox.closest(isVr ? 'li' :'tr').index();

			if(idx>-1) {
				$("#list_resizable").find((isVr ? 'tr' : 'li') + ':eq('+idx+')').find(':checkbox').prop('checked', chkbox.prop('checked'));
			}
			
			if(chkbox.is(":checked")){
				$(this).parents('tr,li').addClass('selected');
			}else{
				$(this).parents('tr,li').removeClass('selected');
			}

			AtclApprList.fn.setToolbar();
		},
		setToolbar: function() {
			var toolbar = $('#atclApprList_toolbar');
			var selInfo = AtclApprList.fn.selectedAtclList();
			var chkCnt = selInfo.atclNoArr.length;

			$('#AtclApprList_selDocProcBtn').toggle(chkCnt > 0);
			toolbar.find('._mailSend').toggle(chkCnt == 1);
			toolbar.find('._atclReg').toggle(chkCnt == 1);
			toolbar.find('._noteSend').toggle(chkCnt == 1);
		},
		/**
		 *  게시등록
		 * */
		onRegBrdAtcl : function(){
			if($(this).parent("li").hasClass("disabled")){
				return;
			}
			var selInfo = AtclApprList.fn.selectedAtclList();
			if(!selInfo.atclNoArr.length) {
				return;
			}
			var options = {
					url : '/service/doc/article/selectJsonDataSendNote',
					data : {atclNo: selInfo.atclNoArr[0], hisSeq: selInfo.hisSeqArr[0]},
					sendDataType : 'string',
					dataType : 'json',
					useWrappedObject : true,
					type : 'post',
					success : function(res, statusText) {
						var files = res.data.fileList;
						var title = res.data.title.substring(res.data.title.indexOf(']')+1);
						var contents = res.data.contents;
						contents = contents.replace('&amp;amp;','&');
						var encodeText = Base64Encoder.encode(contents);
						var fileIdArr = [];
						if(files){
							$.each(files, function(i, file) {
								fileIdArr.push(file.fileName + '＾' + file.fileSize + "＾" + file.fileUrl + "/" + file.realFileName);
							});
						}
						
						var re = /\\/ig;
						var fileInfo =  fileIdArr.join('｜').replace(re, "/");
						
						naon.openUi.brdAtclRegPopup({
							from    : 'DOC',
							subject : Base64Encoder.encode(title),
							atclCn  : encodeText, 
							fileInfo:  fileInfo
						});
					}
			}
			naon.http.ajax(options);
		},
		/**
		 *  쪽지발송
		 * */
		onSendNote : function(){
			if($(this).parent("li").hasClass("disabled")){
				return;
			}
			var selInfo = AtclApprList.fn.selectedAtclList();
			if(!selInfo.atclNoArr.length) {
				return;
			}
			var options = {
					url : '/service/doc/article/selectJsonDataSendNote',
					data : {atclNo: selInfo.atclNoArr[0], hisSeq: selInfo.hisSeqArr[0]},
					sendDataType : 'string',
					dataType : 'json',
					useWrappedObject : true,
					type : 'post',
					success : function(res, statusText) {
						var files = res.data.fileList;
						var title = res.data.title;
						var contents = res.data.contents;
						contents = contents.replace('&amp;amp;','&');
						var encodeText = Base64Encoder.encode(contents);
						var fileIdArr = [];
						if(files){
							$.each(files, function(i, file) {
								fileIdArr.push(file.fileName + '＾' + file.fileSize + "＾" + file.fileUrl + "/" + file.realFileName);
							});
						}
						
						var re = /\\/ig;
						var fileInfo =  fileIdArr.join('｜').replace(re, "/");
						
						naon.openUi.notNoteRegPopup({
							mode:'external',
						    fileInfo : fileInfo,
						    title : Base64Encoder.encode(title) ,
						    contents : encodeText,
						    to: '',
						    cc:''
						});	
					}
			}
			naon.http.ajax(options);
		},
		/**
		 *  메일발송
		 * */
		onSendMail : function(){
			if($(this).parent("li").hasClass("disabled")){
				return;
			}
			var selInfo = AtclApprList.fn.selectedAtclList();
			if(!selInfo.atclNoArr.length) {
				return;
			}
			var options = {
					url : '/service/doc/article/selectJsonDataSendMail',
					data : {atclNo: selInfo.atclNoArr[0], hisSeq: selInfo.hisSeqArr[0]},
					sendDataType : 'string',
					dataType : 'json',
					useWrappedObject : true,
					type : 'post',
					success : function(res, statusText) {
						var files = res.data.fileList;
						var subject = res.data.subject;
						var contents = res.data.contents;
						contents = contents.replace('&amp;amp;','&');
						
						var encodeText = Base64Encoder.encode(contents);
						var fileIdArr = [];
						if(files){
							$.each(files, function(i, file) {
								fileIdArr.push(file.fileName + '＾' + file.fileSize + "＾" + file.fileUrl + "/" + file.realFileName);
							});
						}
						
						
						var re = /\\/ig;
						var fileInfo =  fileIdArr.join('｜').replace(re, "/");
						
						var mailParam = {
								mode: 'gwWrite',
								mailbody: encodeText,
								fileInfo: fileInfo,
								mailSubject : frameworkProperties.exchangeUseYn == 'Y' ? subject : Base64Encoder.encode(subject),
								mailTo: '',
								mailCc: ''
							};
					
						if(typeof(spaceUserInfo) != 'undefined' && spaceUserInfo) mailParam['wksId'] = spaceUserInfo.wksId;			
						naon.openUi.emlMailRegPopup(mailParam);
					}
			}
			naon.http.ajax(options);
		},
		/**
		 * PC저장
		 * */
		onPcSave: function(){
			var selInfo = AtclApprList.fn.selectedAtclList();
			if(!selInfo.atclNoArr.length) {
				return false;
			}

			var options = {
				url : '/service/doc/updn/downloadAtcl',
				data : {atclNos : selInfo.atclNoArr.join(','), hisSeqs: selInfo.hisSeqArr.join(',')},
				sendDataType : 'string',
				dataType : 'file',
				useWrappedObject : true,
				type : 'post',
				success : function(res, statusText) {
				}
			};
			naon.http.ajax(options);
		},
		/**
		 * 승인
		 * */
		onApproval : function(){
			
			var checkedList = $("input[name='chkUserList']:checked");

			if(checkedList.length == 0) {
				naon.ui.alert({
					message: doc_alert_message3/*문서를 먼저 선택하세요*/,
					alertType: 'W',
					callback: function() {}
				});
				return;
			}
			
			naon.ui.confirm({
				message: doc_alert_message73/*문서 등록을 승인하시겠습니까?*/,
				alertType: 'G',
				confirmCallback: function() {
					var atclNoArr = []; 
					var hisSeqArr = [];
					$("input[name='chkUserList']:checked").each(function(){
						if($.inArray($(this).val(), atclNoArr) == -1){
							atclNoArr.push($(this).val());
							hisSeqArr.push($(this).val()+'|'+$(this).data('hisSeq'));
						}
					});
					
					$.ajaxSettings.traditional = true;
					
					var data = {
							brdId : AtclApprList.param.brdId,
							atclNoArr : atclNoArr,
							hisSeqArr : hisSeqArr
					}
					var options = {
						url : '/service/doc/article/approveAtcl',
						data : data,
						sendDataType : 'string',
						dataType : 'json',
						useWrappedObject : true,
						type : 'post',
						success : function(res, statusText) {
							naon.ui.alert({
								message: res.data,
								alertType: 'W',
								callback: function() {
									AtclApprList.fn.paramSet(AtclApprList.pageNo);
									AtclApprList.fn.lenderList(AtclApprList.params);
									ObserverControl.notifyObservers({
										type: 'RESET_CONTENT'
									});
									//목록형인 경우
									if($('#atclList_layoutBtns').find('button:eq(0)').hasClass('active')){
										screenList();
									}
								}
							});
						}
					};
					naon.http.ajax(options);
				},
				cancelCallback: function() {}
			});
		},
		/**
		 * 반려의견 다이얼로그
		 * */
		onRejectDialog : function(){
			var checkedList = $("input[name='chkUserList']:checked");

			if(checkedList.length == 0) {
				naon.ui.alert({
					message: doc_alert_message3/*문서를 먼저 선택하세요*/,
					alertType: 'W',
					callback: function() {}
				});
				return;
			}
			$("#doc_reject_lyr").dialog({
				autoOpen: false,
				resizable: false,
				show: "fade",
				hide: "fade",
				width: "400",
				close : function(){
					$(this).dialog('destroy');
				}
			});
			
			openDialog('doc_reject_lyr');
		},
		/**
		 * 반려
		 * */
		onReject : function(){
			var checkedList = $("input[name='chkUserList']:checked");

			if(checkedList.length == 0) {
				naon.ui.alert({
					message: doc_alert_message3/*문서를 먼저 선택하세요*/,
					alertType: 'W',
					callback: function() {}
				});
				return;
			}
			var atclNoArr = []; 
			var hisSeqArr = [];
			$("input[name='chkUserList']:checked").each(function(){
				if($.inArray($(this).val(), atclNoArr) == -1){
					atclNoArr.push($(this).val());
					hisSeqArr.push($(this).val()+'|'+$(this).data('hisSeq'));
				}
			});
			var insertReject = true;
			$.ajaxSettings.traditional = true;
			var rejectWhyDesc= $('#atclApprList_rejectWhyDesc').val();
			if(rejectWhyDesc!=null && rejectWhyDesc.length!=0){
				 if(AtclApprList.fn.getByteLength(rejectWhyDesc)>1000){
					 
					 $('#atclApprList_rejectWhyDesc').val(AtclApprList.fn.cutByteLength(rejectWhyDesc, 1000));
					 insertReject=false;
					 naon.ui.alert({
							message : doc_alert_message98
						});
				 }
			}
			if(insertReject){
			var data = {
					atclNoArr : atclNoArr,
					rejectWhyDesc : rejectWhyDesc
			}
			var options = {
					url : '/service/doc/article/rejectAtcl',
					data : data,
					sendDataType : 'string',
					dataType : 'json',
					useWrappedObject : true,
					type : 'post',
					success : function(res, statusText) {
						closeDialog('doc_reject_lyr');
						$('#atclApprList_rejectWhyDesc').val('');
						
						naon.ui.alert({
							message: res.data,
							alertType: 'W',
							callback: function() {
								AtclApprList.fn.paramSet(AtclApprList.pageNo);
								AtclApprList.fn.lenderList(AtclApprList.params);
								ObserverControl.notifyObservers({
									type: 'RESET_CONTENT'
								});
								//목록형인 경우
								if($('#atclList_layoutBtns').find('button:eq(0)').hasClass('active')){
									screenList();
								}
							}
						});
					}
				};
			naon.http.ajax(options);
			}
		},
		
		getByteLength : function(s) {

			if (s == null || s.length == 0) {
				return 0;
			}
			var size = 0;

			for ( var i = 0; i < s.length; i++) {
				size += this.charByteSize(s.charAt(i));
			}

			return size;
		},
			
		cutByteLength : function(s, len) {

			if (s == null || s.length == 0) {
				return 0;
			}
			var size = 0;
			var rIndex = s.length;

			for ( var i = 0; i < s.length; i++) {
				size += this.charByteSize(s.charAt(i));
				if( size == len ) {
					rIndex = i + 1;
					break;
				} else if( size > len ) {
					rIndex = i;
					break;
				}
			}

			return s.substring(0, rIndex);
		},

		charByteSize : function(ch) {

			if (ch == null || ch.length == 0) {
				return 0;
			}

			var charCode = ch.charCodeAt(0);

			if (charCode <= 0x00007F) {
				return 1;
			} else if (charCode <= 0x0007FF) {
				return 2;
			} else if (charCode <= 0x00FFFF) {
				return 3;
			} else {
				return 4;
			}
		},
		onUserInfo : function(e){
			UserInfo.fn.openUserInfo(e, $(this).data('empId'));
		},
		
		divisionRefresh : function(){
			if(window.AtclApprList){
				var height;
				height = ($("body").height() - ($("#layout_header").height() || 0) - ($('div.title_bar').outerHeight() || 0));
				if($('.title_guide_bar').css('display') == 'block') height = height - $('.title_guide_bar').outerHeight();
				if($('.location_box').css('display') == 'block') height = height - $('.location_box').outerHeight();
				if($('.mileage_box').css('display') == 'block') height = height - $('.mileage_box').outerHeight();
				
				if($('#content_area').hasClass('content_area_vr')) {
					//$("#division_main").height(height);
					AtclApprList.heightTemp = height;
				
					$("#draggable_hr").css({
					   'top' : height
					});
				
					$(".division_list").css({
					   'height'	: height
					});
					
					$(".list_hr_scroll").css({
					   'height'	: height - $("div.box_toolbar").outerHeight() - $('div.list_head').outerHeight() - $('#atclApprList_paging').outerHeight()
					});
				
					$(".list_vr_scroll").css({
					   'height'	: height - $("div.box_toolbar").outerHeight() - $('#atclApprList_paging').outerHeight()
					});
					
					$(".division_view").css({
					   'height'	: height
					});
				
				} else {
					//$("#division_main").height(height);
					AtclApprList.heightTemp = height;
					height = height / 2;
				
					$("#draggable_hr").css({
					   'top' : height
					});
				
					$(".division_list").css({
					   'height'	: height
					});
				
					$(".list_hr_scroll").css({
					   'height'	: height - $("div.box_toolbar").outerHeight() - $('div.list_head').outerHeight() - $('#atclApprList_paging').outerHeight()
					});
				
					$(".list_vr_scroll").css({
					   'height'	: height - $("div.box_toolbar").outerHeight() - $('#atclApprList_paging').outerHeight()
					});
					
					$(".division_view").css({
					   'height'	: height - $("#draggable_hr").outerHeight()
					});
				
				}
				
				$( "#draggable_hr" ).draggable({
					axis: "y",
					containment: "parent",
					start: function(a) {
						AtclApprList.fn.calculatepercent(a.target.offsetTop);
					},
					drag: function(b) {
						AtclApprList.fn.calculatepercent(b.target.offsetTop);
					},
					stop: function(c) {
						AtclApprList.fn.calculatepercent(c.target.offsetTop);
					}
				});
			}		
		},
		calculatepercent : function(position){
			var a = position;
		
			$('div.division_list').height(position);
			$('div.list_hr_scroll').height(position - 139);
			$('div.division_view').height(AtclApprList.heightTemp - (position + 6));
			$('div.division_view_scroll').height(AtclApprList.heightTemp - (position + 56));
		},
		
		/**
		 * 조회확인
		 * */
		onViewerList : function(){
			var data = {'atclNo':$(this).data("atclNo") };
			var options = {
					url : '/service/doc/article/viewerList',
					data : data,
					sendDataType : 'string',
					dataType : 'html',
					useWrappedObject : true,
					type : 'post',
					success : function(htmlRes, statusText) {
						naon.doc.writeHtml(htmlRes, 'view_report_lyr');
						// 조회 확인 레이어
						$("#view_report_lyr").dialog({
							autoOpen: false,
							resizable: false,
							show: "fade",
							hide: "fade",
							width: "460",
							close: function(){$(this).dialog('destroy')}
						});
						openDialog('view_report_lyr');
					}
			}
			naon.http.ajax(options);
		},
		
		/**
		 * 추천확인
		 * */
		onRecommendList : function(){
			var data = {'atclNo':$(this).data("atclNo") };
			var options = {
					url : '/service/doc/article/recommendList',
					data : data,
					sendDataType : 'string',
					dataType : 'html',
					useWrappedObject : true,
					type : 'post',
					success : function(htmlRes, statusText) {
						naon.doc.writeHtml(htmlRes, 'recommend_report_lyr');
						// 추천 확인 레이어
						$("#recommend_report_lyr").dialog({
							autoOpen: false,
							resizable: false,
							show: "fade",
							hide: "fade",
							width: "460",
							close: function(){$(this).dialog('destroy')}
						});
						openDialog('recommend_report_lyr');
					
						
					}
				};
				naon.http.ajax(options);
		},
		
	}
};
//-------------------------
window.AtclApprList = AtclApprList;

})(jQuery, window);