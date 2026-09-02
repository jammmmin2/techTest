/*
 * Naonsoft Inc., Software License, Version 1.0
 *
 * Copyright (c) 2012 Naonsoft Inc.,
 * All rights reserved.
 *
 * DON'T COPY OR REDISTRIBUTE THIS SOURCE CODE WITHOUT PERMISSION.
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <<Naonsoft Inc.>> OR ITS
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *
 * For more information on this product, please see
 * <<www.naonsoft.com>>
 */
package com.naon.biz.gw.doc.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.naon.biz.gw.doc.bean.BoardBean;
import com.naon.biz.gw.doc.bean.FormBean;
import com.naon.biz.gw.doc.bean.FormCateBean;
import com.naon.biz.gw.doc.service.FormService;
import com.naon.biz.gw.doc.vo.FormVO;
import com.naon.common.exception.MustLoginException;
import com.naon.framework.base.BaseMultiActionController;
import com.naon.framework.session.GwSession;
import com.naon.framework.util.MultilingualUtil;
import com.naon.framework.session.FrameworkSessionUtil;


/**
 * form 관련 처리를 하는 컨트롤러 Class입니다.
 * 
 * @author 안요한(ayh0912@naonsoft.com)
 */
@Controller
@RequestMapping("/{sitemesh}/doc/frm")
public class FormController extends BaseMultiActionController {
	
	/** 메시지 리소스 . */
	@Autowired
	private MessageSourceAccessor msAccessor;
	
	@Autowired
	private FormService formService;
	
	/**
	 * 양식분류를 검색한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws Exception exception
	 */
	@RequestMapping("/goSelectCate")
	public String goSelectCate(HttpServletRequest request, HttpServletResponse response){
		return "/jsp/biz/gw/doc/formSelect";
	}
	
	/**
	 * 양식분류를 검색한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @param frmReq FormVO
	 * @throws Exception exception
	 */
	@RequestMapping("/goSelectCateJson")
	public void goSelectCateJson(HttpServletRequest request, HttpServletResponse response, FormVO frmReq)
			throws Exception {
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		frmReq.setUserInfo(session);
		frmReq.setFormSubType(FormVO.FORM_SUB_TYPE_FOR_NORMAL_BOARD);

		ArrayList<FormCateBean> cateList = formService.getFormCateList(frmReq);
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("cateList", cateList);
		
		if(cateList != null && cateList.size() >0){
			FormCateBean cateBean = (FormCateBean)cateList.get(0);
			frmReq.setUserInfo(session);
			frmReq.setFormCateId( cateBean.getFormCateId() );
			jsonObject.put("formList", formService.getFormListByCate( frmReq ));
		}
		
		this.outJSON(request, response, jsonObject);
	}
	
	/**
	 * 해당양식분류에 해당하는 양식들을 조회한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @param frmReq FormVO
	 * @throws Exception exception
	 */
	@RequestMapping("/formListByCate")
	public void formListByCate(HttpServletRequest request, HttpServletResponse response, FormVO frmReq)
			throws Exception {
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		frmReq.setUserInfo(session);
		
		ArrayList<FormBean> formList = formService.getFormListByCate( frmReq );
		
		this.outJSON(request, response, formList);
	}
	
	/**
	 * 해당양식에 대한 설명을 조회한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @param frmReq FormVO
	 * @throws Exception exception
	 */
	@RequestMapping("/formDesc")
	public void formDesc(HttpServletRequest request, HttpServletResponse response, FormVO frmReq)
			throws Exception {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("formDesc", formService.getFormDesc(frmReq.getFormId()));
		
		this.outJSON(request, response, jsonObject);
	}
	
	/**
	 * 양식리스트를 조회한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws Exception exception
	 */
	@RequestMapping("/listForm")
	public String listForm(HttpServletRequest request, HttpServletResponse response){
		return "/jsp/biz/gw/doc/formList";
	}
	
	/**
	 * 양식리스트를 조회한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws MustLoginException 
	 * @throws Exception exception
	 */
	@RequestMapping("/listFormJson")
	public void listFormJson(HttpServletRequest request, HttpServletResponse response, FormVO frmReq) throws MustLoginException{
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		frmReq.setUserInfo(session);
		
		if(frmReq.isSubTypeForDeptBoard()){
			frmReq.setGrpId(frmReq.getDeptId());
		}else if(StringUtils.isEmpty(frmReq.getGrpId())){
			frmReq.setGrpId(frmReq.getCmpId());
		}
		
		ArrayList<FormCateBean> cateList = formService.getFormCateList(frmReq);
		if(cateList == null || cateList.size()==0){
			formService.insertFormCate( getDefaultFormCate(request, frmReq) );
			cateList = formService.getFormCateList(frmReq);
		}
		
		
		Map<String, Object> frmReqMap = new HashMap<String, Object>();
		frmReqMap.put("formSubType", frmReq.getFormSubType());
		frmReqMap.put("grpId", frmReq.getGrpId());
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("frmReq", frmReqMap);
		jsonObject.put("cateList", cateList);
		jsonObject.put("formList", formService.getFormList(frmReq));
		jsonObject.put("paging", frmReq.getPaging());
		
		this.outJSON(request, response, jsonObject);
	}
	
	/**
	 * 양식을 기본 카테고리를 설정하여 둔다.
	 *
	 * @param request HttpServletRequest
	 * @param frmReq FormRequest
	 * @return cateBean
	 */
	private FormCateBean getDefaultFormCate(HttpServletRequest request, FormVO frmReq) {
		FormCateBean cateBean = new FormCateBean();
		cateBean.generateNewFormCateId();
		cateBean.setFormCateName(msAccessor.getMessage("board.text.form.default.category.name", "공통양식"));
		cateBean.setFormType(frmReq.getFormType());
		cateBean.setFormSubType(frmReq.getFormSubType());
		cateBean.setGrpId(frmReq.getGrpId());
		return cateBean;
	}
	
	/**
	 * 양식분류선택화면으로 이동한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws Exception exception
	 */
	@RequestMapping("/goCateChg")
	public String goCateChg(HttpServletRequest request, HttpServletResponse response){
		return "/jsp/biz/gw/doc/formCateChg";
	}
	
	/**
	 * 양식분류선택화면으로 이동한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws MustLoginException 
	 * @throws Exception exception
	 */
	@RequestMapping("/goCateChgJson")
	public void goCateChgJson(HttpServletRequest request, HttpServletResponse response, FormVO frmReq) throws MustLoginException{
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		frmReq.setUserInfo(session);
		
		if(frmReq.isSubTypeForDeptBoard()){
			frmReq.setGrpId(frmReq.getDeptId());
		}else if(StringUtils.isEmpty(frmReq.getGrpId())){
			frmReq.setGrpId(frmReq.getCmpId());
		}
		
		this.outJSON(request, response, formService.getFormCateList(frmReq));
	}
	
	/**
	 * 양식분류를 변경한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws MustLoginException 
	 * @throws Exception exception
	 */
	@RequestMapping("/doChangeCate")
	public void doChangeCate(HttpServletRequest request, HttpServletResponse response, FormVO frmReq) throws MustLoginException{
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		frmReq.setUserInfo(session);
		formService.updateFormCateChg( frmReq );
		
		this.outJSON(request, response, "SUCCESS");
	}
	
	/**
	 * 양식작성페이지로 이동한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws Exception exception
	 */
	@RequestMapping("/goWriteForm")
	public String goWriteForm(HttpServletRequest request, HttpServletResponse response){
		return "/jsp/biz/gw/doc/formEdit";
	}
	
	/**
	 * 양식작성페이지로 이동한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws MustLoginException 
	 * @throws Exception exception
	 */
	@RequestMapping("/goWriteFormJson")
	public void goWriteFormJson(HttpServletRequest request, HttpServletResponse response, FormVO frmReq) throws MustLoginException{
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		frmReq.setUserInfo(session);
		
		Map<String, Object> frmReqMap = new HashMap<String, Object>();
		frmReqMap.put("formSubType", frmReq.getFormSubType());
		frmReqMap.put("grpId", frmReq.getGrpId());
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("frmReq", frmReqMap);
		jsonObject.put("cateList", formService.getFormCateList(frmReq));
		jsonObject.put("groupMgtYn", (session.isGroupManager()) ? "Y" : "N");
		
		this.outJSON(request, response, jsonObject);
	}
	
	/**
	 * 양식을 작성한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws MustLoginException 
	 * @throws Exception exception
	 */
	@RequestMapping("/doSaveForm")
	public void doSaveForm(HttpServletRequest request, HttpServletResponse response, FormBean formBean) throws MustLoginException{
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		formBean.setUserInfo(session);
		
		formService.updateForm(formBean);
		
		this.outJSON(request, response, msAccessor.getMessage("board.alert.saveformok", "양식을 저장하였습니다."));
	}
	
	/**
	 * 양식수정페이지로 이동한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws Exception exception
	 */
	@RequestMapping("/goEditForm")
	public String goEditForm(HttpServletRequest request, HttpServletResponse response){
		return "/jsp/biz/gw/doc/formEdit";
	}
	
	/**
	 * 양식수정페이지로 이동한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws Exception exception
	 */
	@RequestMapping("/goEditFormJson")
	public void goEditFormJson(HttpServletRequest request, HttpServletResponse response, FormVO frmReq){
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		JSONObject jsonObject = new JSONObject();
		
		jsonObject.put("cateList", formService.getFormCateList(frmReq));
		jsonObject.put("frm", formService.getForm(frmReq.getFormId(),session.getCmpId()));
		jsonObject.put("groupMgtYn", (session.isGroupManager()) ? "Y" : "N");
		
		this.outJSON(request, response, jsonObject);
	}
	
	/**
	 * 양식을 삭제한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws Exception exception
	 */
	@RequestMapping("/doDeleteForm")
	public void doDeleteForm(HttpServletRequest request, HttpServletResponse response, FormVO frmReq){
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		
		formService.deleteForm(frmReq);
		
		this.outJSON(request, response, "SUCCESS");
		
	}
	
	/**
	 * 양식분류관리화면으로 이동한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws Exception exception
	 */
	@RequestMapping("/goCateMng")
	public String goCateMng(HttpServletRequest request, HttpServletResponse response){
		return "/jsp/biz/gw/doc/formCateMng";
	}
	
	/**
	 * 양식분류관리화면으로 이동한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws MustLoginException 
	 * @throws Exception exception
	 */
	@RequestMapping("/goCateMngJson")
	public void goCateMngJson(HttpServletRequest request, HttpServletResponse response, FormVO frmReq) throws MustLoginException{
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		frmReq.setUserInfo(session);
		
		if(frmReq.isSubTypeForDeptBoard()){
			frmReq.setGrpId(frmReq.getDeptId());
		}else if(StringUtils.isEmpty(frmReq.getGrpId())){
			frmReq.setGrpId(frmReq.getCmpId());
		}
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("cateList", formService.getFormCateList2(frmReq));
		
		this.outJSON(request, response, jsonObject);
	}
	
	/**
	 * 양식분류를 추가한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws MustLoginException 
	 * @throws Exception exception
	 */
	@RequestMapping("/doAddCate")
	public void doAddCate(HttpServletRequest request, HttpServletResponse response, FormCateBean cateBean) throws MustLoginException{
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		formService.insertFormCate( cateBean );
		
		this.outJSON(request, response, "SUCCESS");
	}
	
	/**
	 * 양식분류를 수정한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws MustLoginException 
	 * @throws Exception exception
	 */
	@RequestMapping("/doEditCate")
	public void doEditCate(HttpServletRequest request, HttpServletResponse response, FormCateBean cateBean) throws MustLoginException{
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		formService.updateFormCate( cateBean );
		
		this.outJSON(request, response, "SUCCESS");
	}
	
	/**
	 * 양식분류를 삭제한다.
	 *
	 * @param request HttpServletRequest
	 * @param response HttpServletResponse
	 * @throws MustLoginException 
	 * @throws Exception exception
	 */
	@RequestMapping("/doDeleteCate")
	public void doDeleteCate(HttpServletRequest request, HttpServletResponse response, FormCateBean cateBean) throws MustLoginException{
		GwSession session = FrameworkSessionUtil.getUserInfo(request);
		formService.deleteFormCate( cateBean.getFormCateId() );
		
		this.outJSON(request, response, "SUCCESS");
	}
	
}
