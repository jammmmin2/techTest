<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
	<%@ include file="/jsp/framework/commonTaglib.jsp" %>
		<!DOCTYPE html>
		<html>
			<head>
				<title>
					<spring:message code="eapp.label.eapproval" text="전자결재" />
				</title>src/main/webapp/resources/testtest/testtest.js
				<script type="text/javascript"
					src="${pageContext.request.contextPath}/resources/testtest/testtest.js?t=${jsVer}"></script>
				<script type="text/javascript">
					$(document).ready(function () {
						naon.invoker.invoke("Test", 'param', {
							mode: '${param.mode}',
							appId: '${param.appId}'
						});
					});
				</script>
			</head>

			<body>
				<div class="tit_bar hide">
					<h3>
						<spring:message code="rss.text.rssAppDocBoxCountHeader" text="전자결재" />
					</h3>
				</div>
				<div id="test_form">
					<div class="survey_content survey_ex_num">
						<!-- 질문 1 -->
						<div class="question_box">
							<div class="question" style="font-weight: 600;">
								<span class="num num1">1.</span>
								<span class="txt">법률 자문 내용 이해</span>
							</div>
							<div class="example" style="margin-top:10px;margin-left: 10px;">
								<label>
									<input name="test_q1"
													id="test_q1_Y" type="radio" value="Y"
													class="input_rdo">&nbsp;자문 내용 이해하였음.&nbsp;&nbsp;
								</label>
							</div>
						</div>
						<!-- 질문 2 -->
						<div class="question_box" style="margin-top:10px;">
							<div class="question" style="font-weight: 600;">
								<span class="num num2">2.</span>
								<span class="txt">법률 자문 내용 반영 여부</span>
							</div>
							<div class="example" style="margin-top:10px;margin-left: 10px;">
								<label>
									<input name="test_q2"
													id="test_q2_Y" type="radio" value="A"
													class="input_rdo">&nbsp;전부 반영&nbsp;&nbsp;
								</label>
								<label>
									<input name="test_q2"
													id="test_q2_N" type="radio" value="P"
													class="input_rdo">&nbsp;일부 반영(아래 3번 기재)&nbsp;&nbsp;
								</label>
								<label>
									<input name="test_q2"
													id="test_q2_E" type="radio" value="N"
													class="input_rdo">&nbsp;미반영(아래 3번 기재)
								</label>
							</div>
						</div>
						<!-- 질문 3 -->
						<div class="question_box" style="margin-top:10px;">
							<div class="question" style="font-weight: 600;">
								<span class="num num3">3.</span>
								<span class="txt">(일부/미)반영 여부 상세 사유</span>
							</div>
							<div class="opinion" style="margin-top:10px;">
								<textarea id="test_opinCn" cols="70" rows="4" placeholder="내용 및 사유 기재"
									class="textarea" disabled="true" style="width:100%;"></textarea>
							</div>
						</div>
					</div>
				</div>
				<div id="test_btns" class="btn_area">
					<button type="button" class="btn btn_pri _confirmCustom">확인</button>
					<button type="button" class="btn _close"><spring:message code="common.button.close" text="닫기" /></button>
				</div>
			</body>
		</html>