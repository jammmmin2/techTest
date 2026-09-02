<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="/jsp/framework/commonTaglib.jsp"%>

<!DOCTYPE html>
<html>
<head>
<title><spring:message code="doc.title.board" text="문서함" /></title>
<style type="text/css">
a:focus {
  outline: none;
}
</style>
<script type="text/javascript" src="${pageContext.request.contextPath}/resources/biz/gw/doc/js/atclApprList.js?t=${jsVer}"></script>
<script type="text/javascript" src="<spring:message code="imageServer"/>/resources/common/js/ui.js"></script>
<script type="text/javascript">
	$(document).ready(function() {
		naon.invoker.invoke('AtclApprList', 'param', {'brdId':'${atclReq.brdId}',
			'grpId':'${atclReq.grpId}', 
			'schCateId':'${atclReq.schCateId}', 
			'schDeptId':'${atclReq.schDeptId}', 
			'pathName':'${param.pathName}', 
			'title':'${param.title}', 
			'folderLoc':'${param.folderLoc}', 
			'docTabSel':'${param.docTabSel}',
			'listType':'${atclReq.listType}',
			'wksId':'${param.wksId}',
			'srchListType':'${param.srchListType}'});
	});
</script>
</head>
<div class="listbox_cont">
	<div class="box_toolbar">
		<div class="fl">
			<div id="atclApprList_toolbar" class="btn_toolbar">
			</div>
		</div>
		<div class="fr">
			<div class="btn_toolbar">
				<div class="btn_group">
					<button type="button" title="<spring:message code="button.label.print" text="인쇄" />" id="atclApprList_print" class="btn btn_ico"><i class="ico ico_print"><span><spring:message code="button.label.print" text="인쇄" /></span></i></button>
				</div>
			</div>
		</div>
	</div>
	<!-- 목록 -->
	<div class="list_head">
		<div class="edms">
			<table class="lst_hr_tbl">
				<colgroup>
					<col class="col1" style="width:28px;">
					<col class="col2" style="width:74px;">
					<col class="col3" style="width:32px;">
					<col class="col4" style="width:auto;">
					<col class="col5" style="width:70px;">
					<col class="col6" style="width:55px;">
					<col class="col7" style="width:100px;">
					<col class="col8" style="width:100px;">
					<col class="col9" style="width:70px;">
					<col class="col0" style="width:70px;">
				</colgroup>
				<thead>
					<tr>
						<th class="frst"><input type="checkbox" id="atclApprList_chkAll" value="" title="<spring:message code="common.button.selectAll" text="모두선택" />" class="input_chk lst_chk"></th>
						<th>
							<i title="<spring:message code="doc.label.version" text="버전" />" class="iste iste_ver"><span><spring:message code="doc.label.version" text="버전" /></span></i>
							<i title="<spring:message code="doc.label.relateddoc" text="관련문서" />" class="iste iste_rel"><span><spring:message code="doc.label.relateddoc" text="관련문서" /></span></i>
							<i title="<spring:message code="doc.alt.checkout" text="반출" />" class="iste iste_out"><span><spring:message code="doc.alt.checkout" text="반출" /></span></i>
						</th>
						<th><a href="#" id="atclApprListSort_attach" class="sort"><i title="<spring:message code="doc.label.attachfile" text="첨부파일" />" class="lico lico_atch"><span><spring:message code="doc.label.attachfile" text="첨부파일" /></span></i></a></th>	
						<th><div title="<spring:message code="doc.label.title" text="제목" />" class="el"><a href="#" id="atclApprListSort_title" class="sort"><spring:message code="doc.label.title" text="제목" /></a></div></th>
						<th><div title="<spring:message code="doc.column.Q" text="크기" />" class="el"><a href="#" id="atclApprListSort_fileSize" class="sort"><spring:message code="doc.column.Q" text="크기" /></a></div></th>
						<th><div title="<spring:message code="doc.column.P" text="권한" />" class="el"><spring:message code="doc.column.P" text="권한" /></div></th>
						<th><div title="<spring:message code="doc.label.message2" text="등록자" />" class="el"><a href="#" id="atclApprListSort_regUser" class="sort"><spring:message code="doc.label.message2" text="등록자" /></a></div></th>
						<th><div title="<spring:message code="doc.label.message3" text="등록일" />" class="el"><a href="#" id="atclApprListSort_regDate" class="sort"><spring:message code="doc.label.message3" text="등록일" /></a></div></th>
						<th><div title="<spring:message code="doc.label.reader" text="조회" />" class="el"><a href="#" id="atclApprListSort_inq" class="sort"><spring:message code="doc.label.reader" text="조회" /></a></div></th>
						<th class="last"><div title="<spring:message code="doc.label.recommend" text="추천" />" class="el"><a href="#" id="atclApprListSort_recomm" class="sort"><spring:message code="doc.label.recommend" text="추천" /></a></div></th>
					</tr>
				</thead>
			</table>
		</div>
	</div>
	<div id="list_resizable" class="edms">
		<div class="lst_hr list_hr_scroll">
			<table class="lst_hr_tbl">
				<colgroup>
					<col class="col1" style="width:28px;">
					<col class="col2" style="width:74px;">
					<col class="col3" style="width:32px;">
					<col class="col4" style="width:auto;">
					<col class="col5" style="width:70px;">
					<col class="col6" style="width:55px;">
					<col class="col7" style="width:100px;">
					<col class="col8" style="width:100px;">
					<col class="col9" style="width:70px;">
					<col class="col10" style="width:70px;">
				</colgroup>
				<tbody id="atclApprList_list">
					
					<tr>
						<td colspan="11" class="lst_none"><spring:message code="doc.text.list.empty" text="등록된 문서가 없습니다." /></td>
					</tr>
					
				</tbody>
			</table>
		</div>
		<div class="lst_vr list_vr_scroll">
			<ul class="lst_vr_ul" id="atclApprList_list2"></ul>
		</div>
	</div>
	<!--// 목록 -->
	<div class="pagination" id="atclApprList_paging"></div>
</div>
<div class="opacity_bg"></div>
	
<!--// List Container -->

<!-- 반출 레이어 -->
<div id="doc_reject_lyr" title="<spring:message code="board.title.rejectopinnion" text="반려의견" />" style="display:none;">
	<div class="tit_bar hide">
		<h3><spring:message code="board.title.rejectopinnion" text="반려의견" /></h3>
	</div>
	<div class="guide_txt mgb">
		<ul class="bu_lst">
			<li><spring:message code="doc.title.rejectopinnion.guide" text="문서 등록 반려의견을 입력하세요." /></li>
		</ul>
	</div>
	<textarea id="atclApprList_rejectWhyDesc" cols="60" rows="3" class="textarea" style="width:100%; height:200px;"></textarea>
	<div class="btn_area">
		<button type="button" id="atclApprList_rejectConfirm" class="btn btn_pri"><strong><spring:message code="button.label.submit" text="확인" /></strong></button>
		<button type="button" onclick="closeDialog('doc_reject_lyr')" class="btn"><spring:message code="button.label.close" text="닫기" /></button>
	</div>
</div>
<!--// 반출 레이어 -->

<!--// View Container -->
<script type="text/html" id="atclApprList_listTemp">
{{#.}}
<tr {{^readArticle}}class="unread"{{/readArticle}}>
<td class="frst"><input type="checkbox" name="chkUserList" value="{{atclNo}}" title="<spring:message code="board.form.select" text="선택" />" data-brd-id="{{brdId}}" data-his-seq="{{hisSeq}}" class="input_chk lst_chk"></td>
<td>
	<i title="<spring:message code="doc.label.version" text="버전" />" class="iste iste_ver{{#existsVersion}}_on{{/existsVersion}}"><span><spring:message code="doc.label.version" text="버전" /></span></i>
	<i class="iste iste_rel{{#relDocCnt}}_on{{/relDocCnt}}"></i>
	<i class="iste iste_out{{#outState}}_on{{/outState}}"></i>
</td>
<td>{{#attCnt}}<i class="{{fileExtClass}}"><span>{{#fileExtNm}}[{{fileExtNm}}]{{/fileExtNm}}</span></i>{{/attCnt}}</td>
<td class="sub">
	<div class="el_on">
		<div class="sub_div">
			<span class="els">
				{{{brdNnoti}}}
				<a href="#" class="_atcl" data-atcl-no="{{atclNo}}" data-his-seq="{{hisSeq}}" data-brd-id="{{brdId}}">{{#prefixName}}[{{prefixName}}]{{/prefixName}}{{title}}</a>
			</span>
			<span class="elr">
				{{#cmntCnt}}<i class="lico lico_cmt_new" title="<spring:message code="doc.form.boardattribute.comment" text="댓글" />">{{cmntCnt}}</i>{{/cmntCnt}}
				<a href="#" title=<spring:message code="common.label.message55" text="새창으로 보기" />" class="lico lico_pop _popup" data-atcl-no="{{atclNo}}" data-brd-id="{{brdId}}" data-his-seq="{{hisSeq}}"><span><spring:message code="common.label.message55" text="새창으로 보기" /></span></a>
				{{^regDateDiff}}<i title="new" class="lico lico_new"><span>new</span></i>{{/regDateDiff}}
			</span>
		</div>
	</div>
</td>
<td class="ar">{{#attCnt}}{{attSizeFormat}}{{/attCnt}}</td>
<td>
	{{#isDelAndUpdateAuth}}
	<i title="<spring:message code="doc.alt.chgauth" text="수정 혹은 개정" />" class="dpwr1 dpwr1_on"><span><spring:message code="doc.alt.chgauth" text="수정 혹은 개정" /></span></i>
	<i title="<spring:message code="board.button.label.delete" text="삭제" />" class="dpwr2 dpwr2_on"><span><spring:message code="board.button.label.delete" text="삭제" /></span></i>
	{{/isDelAndUpdateAuth}}
	{{#isUpdateAuth}}
	<i title="<spring:message code="doc.alt.chgauth" text="수정 혹은 개정" />" class="dpwr1 dpwr1_on"><span><spring:message code="doc.alt.chgauth" text="수정 혹은 개정" /></span></i>
	<i title="<spring:message code="board.button.label.delete" text="삭제" />" class="dpwr2 dpwr2"><span><spring:message code="board.button.label.delete" text="삭제" /></span></i>
	{{/isUpdateAuth}}
	{{^isNotDelAndUpdateAuth}}
	<i title="<spring:message code="doc.alt.chgauth" text="수정 혹은 개정" />" class="dpwr1 dpwr1"><span><spring:message code="doc.alt.chgauth" text="수정 혹은 개정" /></span></i>
	<i title="<spring:message code="board.button.label.delete" text="삭제" />" class="dpwr2 dpwr2"><span><spring:message code="board.button.label.delete" text="삭제" /></span></i>
	{{/isNotDelAndUpdateAuth}}


</td>
<!-- 가로 목록 등록자 사진 -->
<td class="user">
	<div class="el">
		<span class="photo"><img src="{{thumbFullUrl}}" alt=""></span>
		<span title="{{regName}} {{regPosName}}({{regDeptName}}"><a href="javascript:void(0);" data-emp-id="{{regEmpId}}" class="_userInfo">{{regName}}</a></span>
	</div>
</td>

<td>{{regDateFormat}}</td>
<td><a href="#" onclick="return false;" class="_viewerLst" data-atcl-no="{{atclNo}}">{{viewCnt}}</a></td>
<td><a href="#" onclick="return false;" class="_recommendLst" data-atcl-no="{{atclNo}}">{{recommCnt}}</a></td>
</tr>
{{/.}}
{{^.}}
<tr>
	<td colspan="11" class="lst_none"><spring:message code="doc.text.list.empty" text="등록된 문서가 없습니다." /></td>
</tr>
{{/.}}
</script>

<script type="text/html" id="atclApprList_listTemp2">
{{#.}}
<li {{^readArticle}}class="unread"{{/readArticle}}>
<div class="lst_block lft_photo">
	<span class="check"><input type="checkbox" name="chkUserList" value="{{atclNo}}" title="<spring:message code="board.form.select" text="선택" />" data-brd-id="{{brdId}}" data-his-seq="{{hisSeq}}" class="input_chk lst_chk"></span>
	<span class="sub el">
		{{#attCnt}}<i class="{{fileExtClass}}"><span>{{#fileExtNm}}[{{fileExtNm}}]{{/fileExtNm}}</span></i>{{/attCnt}}
		{{{brdNnoti}}}
		<a href="#" title="{{title}}" class="sub_tp _atcl" data-atcl-no="{{atclNo}}" data-his-seq="{{hisSeq}}" data-brd-id="{{brdId}}">{{#prefixName}}[{{prefixName}}]{{/prefixName}}{{title}}</a>
	</span>
	<span class="photo"><img src="{{thumbFullUrl}}" alt=""></span>
	<span class="name"><em><spring:message code="doc.label.message2" text="등록자" />:</em><a href="javascript:void(0);" data-emp-id="{{regEmpId}}" class="_userInfo">{{regName}}</a></span>
	<span class="date"><em><spring:message code="doc.label.message3" text="등록일" />:</em>{{regDateFormat}}</span>
	<span class="count"><em><spring:message code="doc.label.reader" text="조회" />:</em><a href="#" onclick="return false;" class="_viewerLst" data-atcl-no="{{atclNo}}">{{viewCnt}}</a></span>
	<span class="count"><em><spring:message code="doc.label.recommend" text="추천" />:</em><a href="#" onclick="return false;" class="_recommendLst" data-atcl-no="{{atclNo}}">{{recommCnt}}</a></span>
	{{#cmntCnt}}<i class="lico lico_cmt_new" title="<spring:message code="board.button.label.comment" text="댓글" />">{{cmntCnt}}</i>{{/cmntCnt}}
	<a href="#" title="<spring:message code="common.label.message55" text="새창으로 보기" />" class="lico lico_pop _popup" data-atcl-no="{{atclNo}}" data-brd-id="{{brdId}}" data-his-seq="{{hisSeq}}"><span><spring:message code="common.label.message55" text="새창으로 보기" /></span></a>
	{{^regDateDiff}}<i title="new" class="lico lico_new"><span>new</span></i>{{/regDateDiff}}
	<span class="istes">
		<i title="<spring:message code="doc.alt.versiondoc" text="버전별 문서포함" />" class="iste iste_ver{{#existsVersion}}_on{{/existsVersion}}"><span><spring:message code="doc.alt.versiondoc" text="버전별 문서포함" /></span></i>
		<i title="<spring:message code="doc.alt.relateddoc" text="관련문서 있음" />" class="iste iste_rel{{#relDocCnt}}_on{{/relDocCnt}}"><span><spring:message code="doc.alt.relateddoc" text="관련문서 있음" /></span></i>
		<i title="<spring:message code="doc.alt.checkout" text="반출" />" class="iste iste_out{{#outState}}_on{{/outState}}"><span><spring:message code="doc.alt.checkout" text="반출" /></span></i>
	</span>
</div>
</li>
{{/.}}
{{^.}}
<li class="lst_none"><spring:message code="doc.text.list.empty" text="등록된 문서가 없습니다." /></li>
{{/.}}
</script>

<script type="text/html" id="atclApprList_toolbarTemplate">
	<div class="slt_all">
		<input id="atclApprList_vrChkAll" type="checkbox" value="" title="<spring:message code="common.button.selectAll" text="모두선택" />" class="input_chk _chkAll">
	</div>
	{{#isApprove}}<button type="button" class="btn hr_only _approveBtn"><spring:message code="doc.button.label.approve" text="승인" /></button>{{/isApprove}}
	{{#isReject}}<button type="button" class="btn hr_only _rejectBtn"><spring:message code="doc.button.label.reject" text="반려" /></button>{{/isReject}}
	<div class="btn_drop">
		<button id="AtclApprList_selDocProcBtn" type="button" data-toggle="dropdown" class="btn btn_link drop_tgl" style="display:none"><spring:message code="doc.button.message3" text="선택 문서를" /> <span class="caret"></span></button>
		<ul class="drop_menu">
			{{#isApprove}}<li class="vr_only"><a href="#" class="atclApprList_approveBtn _approveBtn"><spring:message code="doc.button.label.approve" text="승인" /></a></li>{{/isApprove}}
			{{#isReject}}<li class="vr_only"><a href="#" class="atclApprList_rejectBtn _rejectBtn"><spring:message code="doc.button.label.reject" text="반려" /></a></li>{{/isReject}}
			<li><a href="#" class="_mailSend" style="display:none"><spring:message code="common.button.message224" text="메일 발송" /></a></li>
			<li><a href="#" class="_atclReg" style="display:none"><spring:message code="common.label.message483" text="게시 등록" /></a></li>
			<li><a href="#" class="_noteSend" style="display:none"><spring:message code="common.button.message225" text="쪽지 발송" /></a></li>
			<li><a href="#" class="_pcsave"><spring:message code="common.label.message82" text="PC저장" /></a></li>
		</ul>
	</div>
</script>
</html>